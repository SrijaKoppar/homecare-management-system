import os
import sys
from uuid import UUID, uuid4
from datetime import date, timedelta

# Add workspace directory to python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.database.session import SessionLocal
from backend.database.entities import (
    User,
    Organization,
    Membership,
    CareRelationship,
    LeaveRequest,
)
from backend.apis.security import hash_password, verify_password

DEFAULT_PASSWORD = "password123"


def get_or_create_user(db, email, first_name, last_name, display_name=None, status="active", user_id=None, password=DEFAULT_PASSWORD):
    user = db.query(User).filter(User.email.ilike(email)).first()
    if not user:
        user = User(
            id=user_id or uuid4(),
            email=email.strip().lower(),
            first_name=first_name,
            last_name=last_name,
            display_name=display_name or f"{first_name} {last_name}",
            password_hash=hash_password(password),
            status=status
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    elif not verify_password(password, user.password_hash):
        user.password_hash = hash_password(password)
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

def seed():
    db = SessionLocal()
    try:
        print("Starting database seeding...")

        # 1. Organization context
        org_id = UUID("00000000-0000-0000-0000-000000000000")
        org = db.query(Organization).filter(Organization.id == org_id).first()
        if not org:
            org = Organization(
                id=org_id,
                name="CareSys Home Care",
                type="agency",
                status="active"
            )
            db.add(org)
            db.commit()
            db.refresh(org)
            print(f"Created default organization: {org.name}")
        else:
            print(f"Organization {org.name} already exists.")

        # 2. Main Admin User: Srija Koppar
        srija = get_or_create_user(
            db, 
            email="sk@gmail.com", 
            first_name="Srija", 
            last_name="Koppar", 
            user_id=UUID("f0d648f4-bd6d-480f-b70b-bb2351c2f197")
        )
        print(f"User sk@gmail.com is ready (ID: {srija.id})")

        # Admin Membership
        m_admin = db.query(Membership).filter(
            Membership.user_id == srija.id, 
            Membership.organization_id == org.id
        ).first()
        if not m_admin:
            m_admin = Membership(
                user_id=srija.id,
                organization_id=org.id,
                role="agency_admin",
                status="active"
            )
            db.add(m_admin)
            db.commit()
            print("Set sk@gmail.com role to agency_admin.")
        else:
            m_admin.role = "agency_admin"
            db.commit()
            print("Ensured sk@gmail.com is agency_admin.")

        # 3. Caregivers
        cg1 = get_or_create_user(db, "sarah@example.com", "Sarah", "Jenkins")
        cg2 = get_or_create_user(db, "michael@example.com", "Michael", "Chang")
        cg3 = get_or_create_user(db, "emily@example.com", "Emily", "Rodriguez")

        for cg in [cg1, cg2, cg3]:
            m = db.query(Membership).filter(Membership.user_id == cg.id, Membership.organization_id == org.id).first()
            if not m:
                m = Membership(user_id=cg.id, organization_id=org.id, role="caregiver", status="active")
                db.add(m)
        db.commit()
        print("Caregivers and memberships seeded.")

        # 4. Patients
        p1 = get_or_create_user(db, "alice@example.com", "Alice", "Johnson")
        p2 = get_or_create_user(db, "robert@example.com", "Robert", "Smith")

        for p in [p1, p2]:
            m = db.query(Membership).filter(Membership.user_id == p.id, Membership.organization_id == org.id).first()
            if not m:
                m = Membership(user_id=p.id, organization_id=org.id, role="care_recipient", status="active")
                db.add(m)
        db.commit()
        print("Patients and memberships seeded.")

        # 5. Care Relationships
        # Alice Johnson Caregiver (Sarah Jenkins, 24/7)
        r1 = db.query(CareRelationship).filter(
            CareRelationship.care_recipient_id == p1.id, 
            CareRelationship.related_user_id == cg1.id
        ).first()
        if not r1:
            r1 = CareRelationship(
                care_recipient_id=p1.id,
                related_user_id=cg1.id,
                organization_id=org.id,
                role="caregiver",
                is_24x7_caregiver=True,
                status="active"
            )
            db.add(r1)

        # Robert Smith Caregiver (Michael Chang, Backup/Hourly)
        r2 = db.query(CareRelationship).filter(
            CareRelationship.care_recipient_id == p2.id, 
            CareRelationship.related_user_id == cg2.id
        ).first()
        if not r2:
            r2 = CareRelationship(
                care_recipient_id=p2.id,
                related_user_id=cg2.id,
                organization_id=org.id,
                role="caregiver",
                is_24x7_caregiver=False,
                status="active"
            )
            db.add(r2)
        db.commit()
        print("Care relationships seeded.")

        # 6. Leave Requests
        # Let's clean up existing mock leave requests so we start fresh
        db.query(LeaveRequest).delete()
        db.commit()

        lr1 = LeaveRequest(
            organization_id=org.id,
            caregiver_id=cg1.id,
            start_date=date.today() + timedelta(days=1),
            end_date=date.today() + timedelta(days=7),
            reason="Family vacation to Hawaii",
            status="pending"
        )
        lr2 = LeaveRequest(
            organization_id=org.id,
            caregiver_id=cg2.id,
            start_date=date.today() + timedelta(days=5),
            end_date=date.today() + timedelta(days=7),
            reason="Dental appointment and wisdom teeth recovery",
            status="pending"
        )
        lr3 = LeaveRequest(
            organization_id=org.id,
            caregiver_id=cg3.id,
            start_date=date.today() - timedelta(days=5),
            end_date=date.today() - timedelta(days=1),
            reason="Routine health checkup",
            status="approved"
        )
        lr4 = LeaveRequest(
            organization_id=org.id,
            caregiver_id=cg3.id,
            start_date=date.today() + timedelta(days=10),
            end_date=date.today() + timedelta(days=12),
            reason="Personal time off request",
            status="denied"
        )

        db.add_all([lr1, lr2, lr3, lr4])
        db.commit()
        print("Leave requests seeded.")
        print("Database seeding completed successfully!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
