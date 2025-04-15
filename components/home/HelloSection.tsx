"use client";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const HelloSection = () => {
  const [name, setName] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setName(user.displayName || "User");
      }
    });

    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) return "Good Morning";
      if (hour >= 12 && hour < 17) return "Good Afternoon";
      if (hour >= 17 && hour < 21) return "Good Evening";
      return "Good Night";
    };

    setGreeting(getGreeting());

    return () => unsubscribe();
  }, []);

  const now = new Date();
  const time = now.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
  }).format(now);

  return (
    <div className="px-6 pt-5">
      <h1 className="capitalize font-poppins">
        {greeting} {name ?? "..."}
      </h1>
      <p className="font-poppins my-2">
        {date} {time}
      </p>
    </div>
  );
};

export default HelloSection;
