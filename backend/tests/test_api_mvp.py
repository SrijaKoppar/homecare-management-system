"""Integration tests for core MVP-1 API flows."""

import uuid

from backend.tests.conftest import auth_headers, login


def test_login_success(client, seed_org_and_admin):
    data = login(client, seed_org_and_admin)
    assert data["token"].startswith("session:")
    assert data["role"] == "agency_admin"
    assert data["email"] == seed_org_and_admin["email"]


def test_login_rejects_bad_password(client, seed_org_and_admin):
    res = client.post(
        "/api/v1/auth/login",
        json={"email": seed_org_and_admin["email"], "password": "wrong-password"},
    )
    assert res.status_code == 401


def test_login_rejects_unknown_email(client, seed_org_and_admin):
    res = client.post(
        "/api/v1/auth/login",
        json={"email": "nobody@example.com", "password": "password123"},
    )
    assert res.status_code == 401


def test_signup_creates_org_and_logs_in(client):
    email = f"new-{uuid.uuid4().hex[:8]}@example.com"
    res = client.post(
        "/api/v1/auth/signup",
        json={
            "organization_name": "Sunrise Home Care",
            "first_name": "Ada",
            "last_name": "Lovelace",
            "email": email,
            "password": "supersecret123",
        },
    )
    assert res.status_code == 201, res.text
    body = res.json()
    assert body["token"].startswith("session:")
    assert body["role"] == "agency_admin"
    assert body["email"] == email
    assert body["display_name"] == "Ada Lovelace"

    # The new account can immediately log in with the same credentials.
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": "supersecret123"},
    )
    assert login_res.status_code == 200
    assert login_res.json()["organization_id"] == body["organization_id"]


def test_signup_rejects_duplicate_email(client, seed_org_and_admin):
    res = client.post(
        "/api/v1/auth/signup",
        json={
            "organization_name": "Another Org",
            "first_name": "Dup",
            "last_name": "User",
            "email": seed_org_and_admin["email"],
            "password": "supersecret123",
        },
    )
    assert res.status_code == 409


def test_signup_rejects_short_password(client):
    res = client.post(
        "/api/v1/auth/signup",
        json={
            "organization_name": "Short Pw Org",
            "first_name": "A",
            "last_name": "B",
            "email": f"short-{uuid.uuid4().hex[:8]}@example.com",
            "password": "short",
        },
    )
    assert res.status_code == 422


def test_signup_creates_distinct_orgs_for_each_new_account(client):
    email_a = f"org-a-{uuid.uuid4().hex[:8]}@example.com"
    email_b = f"org-b-{uuid.uuid4().hex[:8]}@example.com"

    res_a = client.post(
        "/api/v1/auth/signup",
        json={
            "organization_name": "Org A",
            "first_name": "Alice",
            "last_name": "A",
            "email": email_a,
            "password": "supersecret123",
        },
    )
    res_b = client.post(
        "/api/v1/auth/signup",
        json={
            "organization_name": "Org B",
            "first_name": "Bob",
            "last_name": "B",
            "email": email_b,
            "password": "supersecret123",
        },
    )
    assert res_a.status_code == 201 and res_b.status_code == 201
    assert res_a.json()["organization_id"] != res_b.json()["organization_id"]


def test_protected_endpoint_rejects_missing_token(client, seed_org_and_admin):
    res = client.get("/api/v1/persons")
    assert res.status_code == 401


def test_protected_endpoint_rejects_invalid_token(client, seed_org_and_admin):
    res = client.get("/api/v1/persons", headers=auth_headers("session:bogus.deadbeef"))
    assert res.status_code == 401


def test_protected_endpoint_ignores_client_role_header(client, seed_org_and_admin):
    data = login(client, seed_org_and_admin)
    headers = auth_headers(data["token"])
    headers["X-Role"] = "system_admin"  # should be ignored; role comes from membership

    res = client.get("/api/v1/persons", headers=headers)
    assert res.status_code == 200


def test_create_person_with_membership_role(client, seed_org_and_admin):
    data = login(client, seed_org_and_admin)
    headers = auth_headers(data["token"])

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
    data = login(client, seed_org_and_admin)
    headers = auth_headers(data["token"])

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


def test_update_organization(client, seed_org_and_admin):
    data = login(client, seed_org_and_admin)
    org_id = data["organization_id"]
    headers = auth_headers(data["token"])

    res = client.patch(
        f"/api/v1/organizations/{org_id}",
        headers=headers,
        json={"name": "Updated Org Name"},
    )
    assert res.status_code == 200
    assert res.json()["name"] == "Updated Org Name"


def test_create_person_ignores_client_supplied_organization_id(client, seed_org_and_admin):
    """A caller can't smuggle a different organization_id into the payload."""
    data = login(client, seed_org_and_admin)
    headers = auth_headers(data["token"])
    other_org_id = "99999999-9999-9999-9999-999999999999"

    email = f"patient-{uuid.uuid4().hex[:8]}@example.com"
    res = client.post(
        "/api/v1/persons",
        headers=headers,
        json={
            "email": email,
            "first_name": "Pat",
            "last_name": "Patient",
            "role": "care_recipient",
            "organization_id": other_org_id,
        },
    )
    assert res.status_code == 201
    # Person must belong to the caller's own org, not the spoofed one.
    res2 = client.get("/api/v1/persons?role=care_recipient", headers=headers)
    assert any(p["email"] == email for p in res2.json())


def test_get_person_404s_for_person_outside_caller_org(client, db_session, seed_org_and_admin):
    from backend.database.entities import Organization, User, Membership as MembershipEntity
    from backend.apis.security import hash_password

    other_org = Organization(name="Other Org", type="agency", status="active")
    db_session.add(other_org)
    db_session.flush()

    other_user = User(
        email=f"outsider-{uuid.uuid4().hex[:8]}@example.com",
        first_name="Out",
        last_name="Sider",
        password_hash=hash_password("password123"),
        status="active",
    )
    db_session.add(other_user)
    db_session.flush()

    db_session.add(
        MembershipEntity(
            user_id=other_user.id,
            organization_id=other_org.id,
            role="care_recipient",
            status="active",
        )
    )
    db_session.commit()

    data = login(client, seed_org_and_admin)
    headers = auth_headers(data["token"])

    res = client.get(f"/api/v1/persons/{other_user.id}", headers=headers)
    assert res.status_code == 404

    res_patch = client.patch(
        f"/api/v1/persons/{other_user.id}", headers=headers, json={"first_name": "Hacked"}
    )
    assert res_patch.status_code == 404

    res_delete = client.delete(f"/api/v1/persons/{other_user.id}", headers=headers)
    assert res_delete.status_code == 404


def test_delete_location(client, seed_org_and_admin):
    data = login(client, seed_org_and_admin)
    org_id = data["organization_id"]
    headers = auth_headers(data["token"])

    # Create location
    create_res = client.post(
        "/api/v1/locations",
        headers=headers,
        json={"name": "HQ", "organization_id": org_id, "is_default": True},
    )
    assert create_res.status_code == 201
    loc_id = create_res.json()["id"]

    # Delete location
    del_res = client.delete(
        f"/api/v1/locations/{loc_id}",
        headers=headers,
    )
    assert del_res.status_code == 204

    # Verify deleted
    get_res = client.get(f"/api/v1/locations/{loc_id}", headers=headers)
    assert get_res.status_code == 404
