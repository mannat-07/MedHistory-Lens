#!/usr/bin/env python3
"""Test API endpoints to debug issues"""
import requests
import json
import sys
sys.path.insert(0, 'backend')

BASE_URL = "http://localhost:8000"

def test_health_endpoints():
    """Test health endpoints"""
    print("\n=== Testing API Endpoints ===\n")
    
    # Test 1: Check if backend is running
    print("1. Testing backend connectivity...")
    try:
        resp = requests.get(f"{BASE_URL}/")
        print(f"✓ Backend status: {resp.status_code}")
        print(f"  Response: {resp.json()}\n")
    except Exception as e:
        print(f"✗ Backend error: {e}\n")
        return
    
    # Test 2: Get or create test user
    print("2. Testing user signup...")
    try:
        import time
        user_data = {
            "email": f"test_api_{int(time.time())}_user@test.com",
            "password": "testpass123",
            "name": "Test User"
        }
        resp = requests.post(f"{BASE_URL}/api/auth/register", json=user_data)
        print(f"   Status: {resp.status_code}")
        
        if resp.status_code in [200, 201]:
            user_info = resp.json()
            user_id = user_info.get('user_id')
            print(f"✓ User created/exists: ID={user_id}\n")
        elif resp.status_code == 409:
            print("✓ User already exists\n")
            user_id = 1  # Use existing user
        else:
            print(f"✗ Signup failed: {resp.json()}\n")
            return
    except Exception as e:
        print(f"✗ Signup error: {e}\n")
        return
    
    # Test 3: Login to get token
    print("3. Testing user login...")
    try:
        login_data = {
            "email": user_data["email"],
            "password": user_data["password"]
        }
        resp = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        print(f"   Status: {resp.status_code}")
        
        if resp.status_code == 200:
            token_info = resp.json()
            token = token_info.get('access_token')
            print(f"✓ Login successful, token: {token[:20]}...\n")
        else:
            print(f"✗ Login failed: {resp.json()}\n")
            return
    except Exception as e:
        print(f"✗ Login error: {e}\n")
        return
    
    # Test 4: Test /api/health/dashboard WITHOUT token
    print("4. Testing /api/health/dashboard WITHOUT token...")
    try:
        resp = requests.get(f"{BASE_URL}/api/health/dashboard")
        print(f"   Status: {resp.status_code}")
        print(f"   Response: {resp.json()}\n")
    except Exception as e:
        print(f"   Error: {e}\n")
    
    # Test 5: Test /api/health/dashboard WITH token
    print("5. Testing /api/health/dashboard WITH token...")
    headers = {"Authorization": f"Bearer {token}"}
    try:
        resp = requests.get(f"{BASE_URL}/api/health/dashboard", headers=headers)
        print(f"   Status: {resp.status_code}")
        if resp.status_code == 200:
            print(f"✓ Success response: {json.dumps(resp.json(), indent=2)}\n")
        else:
            print(f"✗ Error: {resp.json()}\n")
    except Exception as e:
        print(f"✗ Error: {e}\n")
    
    # Test 6: Test /api/health/blood WITH token
    print("6. Testing /api/health/blood WITH token...")
    try:
        resp = requests.get(f"{BASE_URL}/api/health/blood", headers=headers)
        print(f"   Status: {resp.status_code}")
        if resp.status_code == 200:
            print(f"✓ Success response: {json.dumps(resp.json(), indent=2)}\n")
        else:
            print(f"✗ Error: {resp.json()}\n")
    except Exception as e:
        print(f"✗ Error: {e}\n")
    
    # Test 7: Check what routes exist
    print("7. Checking available routes...")
    try:
        resp = requests.get(f"{BASE_URL}/openapi.json")
        if resp.status_code == 200:
            routes = resp.json().get("paths", {})
            print(f"   Found {len(routes)} routes:")
            for route in sorted(routes.keys())[:15]:
                print(f"   - {route}")
            print()
        else:
            print(f"   Could not fetch OpenAPI spec\n")
    except Exception as e:
        print(f"   Error: {e}\n")

if __name__ == "__main__":
    test_health_endpoints()
