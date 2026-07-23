# -*- coding: utf-8 -*-
"""
Integration tests for extended Sevenseed Platform feature modules in comonk/main.py.
Tests: BYOK Key Vault, Email & WhatsApp Outreach, AI Business Analyst, AI Hiring Screener, AI Meeting Notetaker.
"""
from __future__ import annotations
import sys, os
import pytest
from fastapi.testclient import TestClient

BACKEND = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", "apps", "comonk"))
if BACKEND not in sys.path:
    sys.path.insert(0, BACKEND)


@pytest.fixture(scope="module")
def client():
    from conftest import load_isolated_app
    app = load_isolated_app("comonk")
    return TestClient(app, raise_server_exceptions=False)


class TestKeyVault:
    def test_verify_api_key_valid(self, client):
        r = client.post("/api/keys/verify", json={"provider": "groq", "api_key": "gsk_valid_key_sample_test"})
        assert r.status_code == 200
        data = r.json()
        assert data["provider"] == "groq"
        assert "valid" in data

    def test_verify_api_key_empty(self, client):
        r = client.post("/api/keys/verify", json={"provider": "groq", "api_key": ""})
        assert r.status_code == 400

    def test_keys_status(self, client):
        r = client.get("/api/keys/status")
        assert r.status_code == 200
        assert "mode" in r.json()


class TestOutreachEngine:
    def test_verify_email_deliverability(self, client):
        r = client.post("/api/outreach/verify-email", json={"email": "founder@sevenseed.com"})
        assert r.status_code == 200
        data = r.json()
        assert data["domain"] == "sevenseed.com"
        assert data["deliverability_score"] > 0

    def test_verify_email_invalid(self, client):
        r = client.post("/api/outreach/verify-email", json={"email": "invalid-email"})
        assert r.status_code == 400

    def test_generate_outreach_sequence(self, client):
        r = client.post("/api/outreach/sequence", json={
            "product_name": "Sevenseed AI",
            "target_audience": "SaaS Founders"
        })
        assert r.status_code == 200
        assert len(r.json()["sequence"]) == 3


class TestBusinessAnalystSuite:
    def test_generate_ba_prd(self, client):
        r = client.post("/api/ba/prd", json={
            "product_name": "Zero-Cost Hiring Portal",
            "concept_description": "AI candidate voice interviewer for early startups"
        })
        assert r.status_code == 200
        data = r.json()
        assert "prd_title" in data
        assert len(data["functional_requirements"]) > 0

    def test_generate_ba_prd_empty(self, client):
        r = client.post("/api/ba/prd", json={"product_name": "", "concept_description": ""})
        assert r.status_code == 400


class TestHiringScreener:
    def test_generate_hiring_questions(self, client):
        r = client.post("/api/hiring/questions", json={"role": "Backend Engineer"})
        assert r.status_code == 200
        assert len(r.json()["question_set"]) == 3

    def test_evaluate_candidate_answer(self, client):
        r = client.post("/api/hiring/evaluate", json={
            "question": "Explain database indexing in PostgreSQL",
            "candidate_answer": "Indexes B-tree data structures that accelerate SELECT queries by reducing disk I/O."
        })
        assert r.status_code == 200
        assert r.json()["score"] > 0


class TestMeetingNotetaker:
    def test_summarize_meeting_transcript(self, client):
        r = client.post("/api/meeting/summarize", json={
            "meeting_title": "Investor Pitch Sync",
            "transcript_text": "Founder: We built 7 free apps.\nInvestor: Great model, let us proceed."
        })
        assert r.status_code == 200
        data = r.json()
        assert data["meeting_title"] == "Investor Pitch Sync"
        assert len(data["action_items"]) > 0


class TestBackupFeatures:
    def test_create_crm_lead(self, client):
        r = client.post('/api/crm/lead', json={'contact_name': 'Rahul Founder', 'email': 'rahul@startup.com'})
        assert r.status_code == 200
        assert r.json()['lead_score'] > 0

    def test_list_crm_pipeline(self, client):
        r = client.get('/api/crm/leads')
        assert r.status_code == 200
        assert 'pipeline_stages' in r.json()

    def test_employee_check_in(self, client):
        r = client.post('/api/attendance/check-in', json={'employee_id': 'EMP-101', 'location': 'Remote'})
        assert r.status_code == 200
        assert r.json()['status'] == 'Checked In'

    def test_get_attendance_summary(self, client):
        r = client.get('/api/attendance/summary')
        assert r.status_code == 200
        assert r.json()['total_employees'] == 42

    def test_create_meetair_room(self, client):
        r = client.post('/api/meetair/create-room', json={'room_name': 'Investor Sync'})
        assert r.status_code == 200
        assert 'webrtc_url' in r.json()

    def test_generate_brain_quiz(self, client):
        r = client.post('/api/quiz/generate', json={'topic': 'System Architecture', 'num_questions': 3})
        assert r.status_code == 200
        assert len(r.json()['quiz_set']) == 3


class TestBackup2018Features:
    def test_create_support_ticket(self, client):
        r = client.post('/api/support/ticket', json={'subject': 'Login Issue', 'user_email': 'user@startup.com', 'message': 'Cannot login'})
        assert r.status_code == 200
        assert r.json()['status'] == 'Open'

    def test_list_support_tickets(self, client):
        r = client.get('/api/support/tickets')
        assert r.status_code == 200
        assert 'open_tickets_count' in r.json()

    def test_generate_exam_practice(self, client):
        r = client.post('/api/exam/practice', json={'exam_type': 'PTE', 'section': 'Speaking'})
        assert r.status_code == 200
        assert 'prompt' in r.json()

    def test_match_urgent_jobs(self, client):
        r = client.post('/api/jobs/match', json={'candidate_skills': ['Python'], 'desired_role': 'AI Developer'})
        assert r.status_code == 200
        assert len(r.json()['top_matches']) > 0

    def test_get_deal_radar(self, client):
        r = client.get('/api/deals/radar')
        assert r.status_code == 200
        assert len(r.json()['top_deals']) > 0


class TestBackup2019Features:
    def test_book_appointment(self, client):
        r = client.post('/api/beauty/book', json={'client_name': 'Priya Patel', 'service_name': 'Consultation'})
        assert r.status_code == 200
        assert r.json()['status'] == 'Confirmed'

    def test_list_appointments(self, client):
        r = client.get('/api/beauty/appointments')
        assert r.status_code == 200
        assert 'total_bookings_today' in r.json()

    def test_create_ad_campaign(self, client):
        r = client.post('/api/ads/campaign', json={'campaign_name': 'Sevenseed Launch', 'budget_usd': 500})
        assert r.status_code == 200
        assert r.json()['status'] == 'Active'

    def test_get_ad_analytics(self, client):
        r = client.get('/api/ads/analytics')
        assert r.status_code == 200
        assert 'total_impressions' in r.json()

    def test_process_wallet_transaction(self, client):
        r = client.post('/api/wallet/transact', json={'user_id': 'USR-900', 'amount': 100.0, 'transaction_type': 'Credit'})
        assert r.status_code == 200
        assert r.json()['status'] == 'Success'

    def test_get_wallet_balance(self, client):
        r = client.get('/api/wallet/balance?user_id=USR-900')
        assert r.status_code == 200
        assert r.json()['currency'] == 'INR'

    def test_place_food_order(self, client):
        r = client.post('/api/food/order', json={'customer_name': 'Amit Shah', 'items': ['Coffee', 'Sandwich']})
        assert r.status_code == 200
        assert r.json()['status'] == 'Kitchen Preparing'


class TestBackup2018ExtraFeatures:
    def test_log_fitness_activity(self, client):
        r = client.post('/api/fitness/log', json={'user_id': 'USR-101', 'activity_type': 'Running', 'duration_minutes': 30})
        assert r.status_code == 200
        assert r.json()['status'] == 'Logged'

    def test_get_fitness_summary(self, client):
        r = client.get('/api/fitness/summary?user_id=USR-101')
        assert r.status_code == 200
        assert r.json()['total_workouts_this_week'] > 0

    def test_dispatch_fleet_route(self, client):
        r = client.post('/api/fleet/route', json={'origin': 'Ahmedabad', 'destination': 'Surat'})
        assert r.status_code == 200
        assert r.json()['dispatch_status'] == 'En Route'

    def test_make_hotel_reservation(self, client):
        r = client.post('/api/hotel/reserve', json={'guest_name': 'Kunal Patel', 'hotel_name': 'Marriott', 'nights': 3})
        assert r.status_code == 200
        assert r.json()['status'] == 'Confirmed'

    def test_match_donors(self, client):
        r = client.post('/api/donor/match', json={'blood_group': 'O+', 'city': 'Ahmedabad'})
        assert r.status_code == 200
        assert len(r.json()['donors']) > 0


class TestBackup2020Features:
    def test_book_taxi_ride(self, client):
        r = client.post('/api/taxi/book', json={'passenger_name': 'Rohan Mehta', 'pickup_location': 'SG Highway'})
        assert r.status_code == 200
        assert r.json()['status'] == 'Driver Dispatched'

    def test_get_taxi_fleet_status(self, client):
        r = client.get('/api/taxi/status')
        assert r.status_code == 200
        assert r.json()['active_cabs'] > 0

    def test_search_beverages(self, client):
        r = client.post('/api/beverage/search', json={'category': 'Craft IPA', 'max_price': 500})
        assert r.status_code == 200
        assert len(r.json()['items']) > 0

    def test_update_merchant_inventory(self, client):
        r = client.post('/api/merchant/inventory', json={'store_id': 'STORE-101', 'item_name': 'Fresh Milk', 'quantity': 100})
        assert r.status_code == 200
        assert r.json()['status'] == 'Inventory Synchronized'

    def test_list_local_merchants(self, client):
        r = client.get('/api/merchant/stores')
        assert r.status_code == 200
        assert r.json()['total_merchants'] > 0

    def test_create_game_lobby(self, client):
        r = client.post('/api/lobby/create', json={'host_name': 'PlayerOne', 'max_players': 4})
        assert r.status_code == 200
        assert 'socket_room_token' in r.json()


class TestBackup2021Features:
    def test_estimate_property_value(self, client):
        r = client.post('/api/realestate/estimate', json={'property_type': 'Apartment', 'area_sqft': 1000})
        assert r.status_code == 200
        assert r.json()['estimated_valuation_inr'] == 6500000.0

    def test_list_featured_properties(self, client):
        r = client.get('/api/realestate/properties')
        assert r.status_code == 200
        assert len(r.json()['featured']) > 0

    def test_place_grocery_order(self, client):
        r = client.post('/api/grocery/order', json={'customer_name': 'Kavita Patel', 'delivery_address': 'Bodakdev'})
        assert r.status_code == 200
        assert r.json()['status'] == 'Dispatched'

    def test_place_tailor_order(self, client):
        r = client.post('/api/tailor/order', json={'client_name': 'Sanjay Shah', 'garment_type': 'Blazer'})
        assert r.status_code == 200
        assert r.json()['status'] == 'Stitching In Progress'

    def test_get_crypto_token_prices(self, client):
        r = client.get('/api/crypto/prices')
        assert r.status_code == 200
        assert len(r.json()['tokens']) >= 4


class TestBackup2022Features:
    def test_create_milk_subscription(self, client):
        r = client.post('/api/milk/subscribe', json={'customer_name': 'Meera Joshi', 'milk_type': 'Organic Milk'})
        assert r.status_code == 200
        assert r.json()['status'] == 'Active Daily Delivery'

    def test_get_daily_deliveries(self, client):
        r = client.get('/api/milk/deliveries')
        assert r.status_code == 200
        assert r.json()['total_active_subscriptions'] > 0

    def test_redeem_reward_points(self, client):
        r = client.post('/api/rewards/redeem', json={'user_id': 'USR-101', 'points_to_redeem': 500})
        assert r.status_code == 200
        assert r.json()['status'] == 'Redeemed'

    def test_get_user_points(self, client):
        r = client.get('/api/rewards/points?user_id=USR-101')
        assert r.status_code == 200
        assert r.json()['tier'] == 'Gold Member'

    def test_compare_insurance_policies(self, client):
        r = client.post('/api/insurance/compare', json={'age': 28, 'coverage_amount_lakhs': 15.0})
        assert r.status_code == 200
        assert len(r.json()['recommended_policies']) > 0

    def test_submit_startup_pitch(self, client):
        r = client.post('/api/startup/pitch', json={'startup_name': 'Sevenseed AI', 'tagline': 'AI Venture Studio', 'founder_email': 'kunal@sevenseed.com'})
        assert r.status_code == 200
        assert r.json()['status'] == 'Published on Founder Showcase'


class TestBackup2023Features:
    def test_request_blood_units(self, client):
        r = client.post('/api/bloodbank/request', json={'hospital_name': 'Apollo Hospital', 'blood_group': 'O+', 'units_required': 3})
        assert r.status_code == 200
        assert r.json()['inventory_status'] == 'Reserved for Dispatch'

    def test_get_blood_bank_inventory(self, client):
        r = client.get('/api/bloodbank/inventory')
        assert r.status_code == 200
        assert r.json()['total_units_available'] > 0

    def test_book_car_wash(self, client):
        r = client.post('/api/carwash/book', json={'customer_name': 'Vikram Rathore', 'vehicle_model': 'SUV'})
        assert r.status_code == 200
        assert r.json()['status'] == 'Washer Assigned'

    def test_dispatch_parcel_courier(self, client):
        r = client.post('/api/courier/dispatch', json={'sender_name': 'Rajesh Sharma', 'pickup_address': 'Navrangpura', 'delivery_address': 'SG Highway', 'package_weight_kg': 2.0})
        assert r.status_code == 200
        assert r.json()['status'] == 'Rider Dispatched for Pickup'

    def test_generate_ai_3d_asset(self, client):
        r = client.post('/api/ai3d/generate', json={'prompt': 'Futuristic Robot Arm', 'file_format': 'GLTF'})
        assert r.status_code == 200
        assert r.json()['status'] == 'Render Complete'
