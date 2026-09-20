"use client";

import { useEffect } from "react";

export function EntranceAnimator() {
  useEffect(() => {
    const runAnimation = () => {
      const elements = document.querySelectorAll("[data-blur-in]");
      elements.forEach((el) => el.classList.add("blur-in--visible"));
    };

    // Check if preloader has run
    const seen = sessionStorage.getItem("seen-preloader");
    const delay = seen ? 100 : 1800;

    const timer = setTimeout(runAnimation, delay);

    // Also run on dynamic content updates / route changes
    const observer = new MutationObserver(() => {
      runAnimation();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return null;
}
