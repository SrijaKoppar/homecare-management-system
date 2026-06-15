"""Integration tests for core MVP-1 API flows."""

import uuid

from backend.tests.conftest import auth_headers


def test_login_success(client, seed_org_and_admin):
    res = client.post(
        "/api/v1/auth/login",
        json={"email": seed_org_and_admin["email"], "password": seed_org_and_admin["password"]},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["token"].startswith("token:")
    assert data["role"] == "agency_admin"
    assert data["email"] == seed_org_and_admin["email"]


def test_login_rejects_bad_password(client, seed_org_and_admin):
    res = client.post(
        "/api/v1/auth/login",
        json={"email": seed_org_and_admin["email"], "password": "wrong-password"},
    )
    assert res.status_code == 401


def test_create_person_with_membership_role(client, seed_org_and_admin):
    login = client.post(
        "/api/v1/auth/login",
        json={"email": seed_org_and_admin["email"], "password": seed_org_and_admin["password"]},
    )
    token = login.json()["token"]
    headers = auth_headers(token)

    email = f"patient-{uuid.uuid4().hex[:8]}@example.com"
    res = client.post(
        "/api/v1/persons",
        headers=headers,
        json={
            "email": email,
            "first_name": "Pat",
            "last_name": "Patient",
            "role": "care_recipient",
        },
    )
    assert res.status_code == 201
    body = res.json()
    assert body["role"] == "care_recipient"
    assert body["email"] == email


def test_list_persons_filtered_by_role(client, seed_org_and_admin):
    login = client.post(
        "/api/v1/auth/login",
        json={"email": seed_org_and_admin["email"], "password": seed_org_and_admin["password"]},
    )
    token = login.json()["token"]
    headers = auth_headers(token)

    caregiver_email = f"cg-{uuid.uuid4().hex[:8]}@example.com"
    client.post(
        "/api/v1/persons",
        headers=headers,
        json={
            "email": caregiver_email,
            "first_name": "Care",
            "last_name": "Giver",
            "role": "caregiver",
        },
    )

    res = client.get("/api/v1/persons?role=caregiver", headers=headers)
    assert res.status_code == 200
    caregivers = res.json()
    assert any(p["email"] == caregiver_email for p in caregivers)
    assert all(p["role"] == "caregiver" for p in caregivers)
