import { type ProposalFormValues } from "./schemas";
import { type Proposal, type Dashboard } from "./types";

const BASE_URL = import.meta.env.VITE_API_URL;

function getToken() {
  return localStorage.getItem("token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Request failed");
  }

  return res.json();
}

export function register(name: string, email: string, password: string) {
  return request<{ id: string; email: string; token: string }>(
    "/api/auth/register",
    {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    },
  );
}

export function login(email: string, password: string) {
  return request<{ token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getProposals() {
  return request<{ proposals: Proposal[] }>("/api/proposals");
}

export function getDashboard() {
  return request<Dashboard>("/api/dashboard");
}

export function getProposal(id: string) {
  return request<{ proposal: Proposal }>(`/api/proposals/${id}`);
}

export function createProposal(data: ProposalFormValues) {
  return request<{ proposal: Proposal }>("/api/proposals", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateProposal(id: string, data: ProposalFormValues) {
  return request<{ proposal: Proposal }>(`/api/proposals/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
