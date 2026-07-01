import { useState, useEffect } from "react";
import { ChildProfile, SicknessRecord, Appointment } from "../types";
import { readStoredJson } from "../utils/helpers";

export function useChildProfile() {
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null);

  const [inputChildName, setInputChildName] = useState("");
  const [inputChildGender, setInputChildGender] = useState<"boy" | "girl">("boy");
  const [inputChildBirthdate, setInputChildBirthdate] = useState("");

  const [completedVaccines, setCompletedVaccines] = useState<string[]>(() => {
    return readStoredJson<string[]>("pediatr_completed_vaccines", []);
  });

  const [sicknessLogs, setSicknessLogs] = useState<SicknessRecord[]>(() => {
    return readStoredJson<SicknessRecord[]>("pediatr_sickness_logs", []);
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    return readStoredJson<Appointment[]>("pediatr_appointments", []);
  });

  const loadProfile = async () => {
    const token = localStorage.getItem("pediatr_jwt");
    if (!token) return;
    try {
      const res = await fetch("/api/child-profile", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setChildProfile(data.profile);
      }
    } catch (err) {
      console.error("Failed to load profile", err);
    }
  };

  const saveProfile = async (profile: ChildProfile) => {
    const token = localStorage.getItem("pediatr_jwt");
    if (!token) {
      // Offline fallback
      setChildProfile(profile);
      return;
    }
    try {
      const res = await fetch("/api/child-profile", {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ profile })
      });
      if (res.ok) {
        const data = await res.json();
        setChildProfile(data.profile);
      }
    } catch (err) {
      console.error("Failed to save profile", err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    localStorage.setItem("pediatr_completed_vaccines", JSON.stringify(completedVaccines));
  }, [completedVaccines]);

  useEffect(() => {
    localStorage.setItem("pediatr_sickness_logs", JSON.stringify(sicknessLogs));
  }, [sicknessLogs]);

  useEffect(() => {
    localStorage.setItem("pediatr_appointments", JSON.stringify(appointments));
  }, [appointments]);

  return {
    childProfile, setChildProfile, saveProfile, loadProfile,
    inputChildName, setInputChildName,
    inputChildGender, setInputChildGender,
    inputChildBirthdate, setInputChildBirthdate,
    completedVaccines, setCompletedVaccines,
    sicknessLogs, setSicknessLogs,
    appointments, setAppointments
  };
}
