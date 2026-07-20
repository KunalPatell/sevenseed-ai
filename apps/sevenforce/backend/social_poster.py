# -*- coding: utf-8 -*-
"""
Multi-platform social posting (ported from E:\\SAAS-Social-Media-main's Node/Express
backend — SocialMedia/{Facebook,Instagram,Linkedin,Twitter} controllers + src/workers).

Only the actual publish calls are ported, not the OAuth-connect / account-storage
layer: that requires per-platform developer apps (FB App ID/Secret, LinkedIn app,
Twitter app) registered by the user, plus a multi-tenant account database — a
separate, much bigger build. This module expects a caller-supplied access token
(from Sevenforce's own env, a Wave campaign config, or the calling request) and
performs the same Graph/REST calls the Node backend made.
"""
from __future__ import annotations
import time
import requests


def post_facebook(page_id: str, access_token: str, caption: str, media_url: str | None = None,
                   media_type: str = "IMAGE") -> dict:
    """Publish to a Facebook Page (personal profiles are blocked by Meta — Page only)."""
    if not (page_id and access_token):
        return {"success": False, "error": "page_id and access_token are required."}
    try:
        if media_type == "VIDEO" and media_url:
            r = requests.post(f"https://graph.facebook.com/v18.0/{page_id}/videos",
                               data={"file_url": media_url, "description": caption, "access_token": access_token},
                               timeout=30)
        elif media_url:
            r = requests.post(f"https://graph.facebook.com/v18.0/{page_id}/photos",
                               data={"url": media_url, "caption": caption, "access_token": access_token},
                               timeout=30)
        else:
            r = requests.post(f"https://graph.facebook.com/v18.0/{page_id}/feed",
                               data={"message": caption, "access_token": access_token}, timeout=30)
        data = r.json()
        if r.status_code >= 400:
            return {"success": False, "error": data.get("error", {}).get("message", r.text)}
        return {"success": True, "platform": "facebook", "post_id": data.get("post_id") or data.get("id")}
    except Exception as e:
        return {"success": False, "error": str(e)}


def post_instagram(ig_user_id: str, access_token: str, caption: str, media_url: str,
                    media_type: str = "IMAGE", max_poll: int = 10) -> dict:
    """Publish to Instagram via the 2-step container -> publish flow (image or REELS video)."""
    if not (ig_user_id and access_token and media_url):
        return {"success": False, "error": "ig_user_id, access_token and media_url are required."}
    base = "https://graph.instagram.com/v18.0"
    try:
        container_params = {"access_token": access_token, "caption": caption}
        if media_type in ("VIDEO", "REELS"):
            container_params["video_url"] = media_url
            container_params["media_type"] = "REELS"
        else:
            container_params["image_url"] = media_url

        r = requests.post(f"{base}/{ig_user_id}/media", params=container_params, timeout=30)
        data = r.json()
        if r.status_code >= 400:
            return {"success": False, "error": data.get("error", {}).get("message", r.text)}
        creation_id = data["id"]

        for _ in range(max_poll):
            sr = requests.get(f"{base}/{creation_id}",
                               params={"fields": "status_code,status", "access_token": access_token}, timeout=15)
            sdata = sr.json()
            status_code = sdata.get("status_code")
            if status_code == "FINISHED":
                break
            if status_code == "ERROR":
                return {"success": False, "error": f"Media processing failed: {sdata.get('status')}"}
            time.sleep(3)
        else:
            return {"success": False, "error": "Media container timed out."}

        pr = requests.post(f"{base}/{ig_user_id}/media_publish",
                            params={"creation_id": creation_id, "access_token": access_token}, timeout=30)
        pdata = pr.json()
        if pr.status_code >= 400:
            return {"success": False, "error": pdata.get("error", {}).get("message", pr.text)}
        return {"success": True, "platform": "instagram", "post_id": pdata.get("id")}
    except Exception as e:
        return {"success": False, "error": str(e)}


def post_linkedin(person_urn: str, access_token: str, text: str, media_url: str | None = None) -> dict:
    """Publish to LinkedIn via UGC Posts API. Uploads an image natively first if media_url given."""
    if not (person_urn and access_token):
        return {"success": False, "error": "person_urn and access_token are required."}
    auth_headers = {"Authorization": f"Bearer {access_token}", "X-Restli-Protocol-Version": "2.0.0"}
    share_media_category = "NONE"
    media_assets = []
    try:
        if media_url:
            img = requests.get(media_url, timeout=30).content
            reg = requests.post(
                "https://api.linkedin.com/v2/assets?action=registerUpload",
                json={"registerUploadRequest": {
                    "recipes": ["urn:li:digitalmediaRecipe:feedshare-image"],
                    "owner": person_urn,
                    "serviceRelationships": [{"relationshipType": "OWNER", "identifier": "urn:li:userGeneratedContent"}],
                }},
                headers={**auth_headers, "Content-Type": "application/json"}, timeout=30)
            reg_data = reg.json()
            if reg.status_code >= 400:
                return {"success": False, "error": reg_data.get("message", reg.text)}
            upload_url = reg_data["value"]["uploadMechanism"]["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"]["uploadUrl"]
            asset_urn = reg_data["value"]["asset"]
            requests.put(upload_url, data=img,
                         headers={"Authorization": f"Bearer {access_token}", "Content-Type": "application/octet-stream"},
                         timeout=60)
            share_media_category = "IMAGE"
            media_assets = [{"status": "READY", "media": asset_urn, "title": {"text": "Uploaded Image"}}]

        post_body = {
            "author": person_urn,
            "lifecycleState": "PUBLISHED",
            "specificContent": {"com.linkedin.ugc.ShareContent": {
                "shareCommentary": {"text": text},
                "shareMediaCategory": share_media_category,
                "media": media_assets,
            }},
            "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"},
        }
        r = requests.post("https://api.linkedin.com/v2/ugcPosts", json=post_body,
                           headers={**auth_headers, "Content-Type": "application/json"}, timeout=30)
        data = r.json() if r.text else {}
        if r.status_code >= 400:
            return {"success": False, "error": data.get("message", r.text)}
        return {"success": True, "platform": "linkedin", "post_id": data.get("id") or r.headers.get("x-restli-id")}
    except Exception as e:
        return {"success": False, "error": str(e)}


def post_twitter(access_token: str, text: str) -> dict:
    """Publish a tweet via Twitter/X API v2 (text-only — media upload needs the separate v1.1 endpoint)."""
    if not access_token:
        return {"success": False, "error": "access_token is required."}
    try:
        r = requests.post("https://api.twitter.com/2/tweets", json={"text": text},
                           headers={"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"},
                           timeout=30)
        data = r.json()
        if r.status_code >= 400:
            return {"success": False, "error": data.get("detail") or data.get("title") or r.text}
        return {"success": True, "platform": "twitter", "post_id": data.get("data", {}).get("id")}
    except Exception as e:
        return {"success": False, "error": str(e)}


_PUBLISHERS = {
    "facebook": lambda p: post_facebook(p.get("target_id"), p.get("access_token"), p.get("caption", ""),
                                         p.get("media_url"), p.get("media_type", "IMAGE")),
    "instagram": lambda p: post_instagram(p.get("target_id"), p.get("access_token"), p.get("caption", ""),
                                           p.get("media_url"), p.get("media_type", "IMAGE")),
    "linkedin": lambda p: post_linkedin(p.get("target_id"), p.get("access_token"), p.get("caption", ""),
                                         p.get("media_url")),
    "twitter": lambda p: post_twitter(p.get("access_token"), p.get("caption", "")),
}


def publish(platform: str, params: dict) -> dict:
    fn = _PUBLISHERS.get((platform or "").strip().lower())
    if not fn:
        return {"success": False, "error": f"Unknown platform '{platform}'. Use facebook/instagram/linkedin/twitter."}
    return fn(params)
