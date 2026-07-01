import { useState, useEffect } from "react";
import { AppUser } from "../types";

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem("pediatr_jwt") || null;
  });

  const [authView, setAuthView] = useState<"login" | "register">("login");
  const [authType, setAuthType] = useState<"private" | "company">("private");
  
  // Forms state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const fetchCurrentUser = async () => {
    if (!authToken) return;
    try {
      const res = await fetch("/api/auth/me", {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      } else {
        handleLogout();
      }
    } catch {
      handleLogout();
    }
  };

  useEffect(() => {
    if (authToken) {
      localStorage.setItem("pediatr_jwt", authToken);
      fetchCurrentUser();
    } else {
      localStorage.removeItem("pediatr_jwt");
      setCurrentUser(null);
    }
  }, [authToken]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setAuthToken(data.token);
        setCurrentUser(data.user);
      } else {
        alert(data.error || "Ошибка входа");
      }
    } catch (err) {
      alert("Ошибка сети");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regEmail, password: regPassword, name: regName, type: authType })
      });
      const data = await res.json();
      if (res.ok) {
        // Auto-login after register
        setLoginEmail(regEmail);
        setLoginPassword(regPassword);
        setAuthView("login");
        alert("Регистрация успешна! Выполняется вход...");
        await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: regEmail, password: regPassword })
        }).then(r => r.json()).then(d => {
          if (d.token) {
            setAuthToken(d.token);
            setCurrentUser(d.user);
          }
        });
      } else {
        alert(data.error || "Ошибка регистрации");
      }
    } catch (err) {
      alert("Ошибка сети");
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
  };

  return {
    currentUser, setCurrentUser, authToken, setAuthToken,
    authView, setAuthView,
    authType, setAuthType,
    loginEmail, setLoginEmail,
    loginPassword, setLoginPassword,
    regName, setRegName,
    regEmail, setRegEmail,
    regPassword, setRegPassword,
    handleLogin, handleRegister, handleLogout
  };
}
