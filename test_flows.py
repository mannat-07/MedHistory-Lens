import requests
import base64
import tempfile
import os

print('=' * 50)
print('MEDHISTORY-LENS BASIC FLOW TESTS')
print('=' * 50)

# Test 1: Signup
print('\n📝 TEST 1: Signup')
print('-' * 40)
signup_response = requests.post('http://localhost:8000/api/auth/register', json={
    'email': 'diana@example.com',
    'password': 'dianasecurepass123',
    'name': 'Diana Prince'
})
if signup_response.status_code == 200:
    print('✓ Signup successful')
    signup_token = signup_response.json()['access_token']
    signup_user = signup_response.json()['user']
    print('  User:', signup_user['email'], '(' + signup_user['name'] + ')')
else:
    print('✗ Signup failed:', signup_response.status_code)

# Test 2: Login
print('\n🔐 TEST 2: Login')
print('-' * 40)
login_response = requests.post('http://localhost:8000/api/auth/login', json={
    'email': 'diana@example.com',
    'password': 'dianasecurepass123'
})
if login_response.status_code == 200:
    print('✓ Login successful')
    login_token = login_response.json()['access_token']
    print('  Token:', login_token[:30] + '...')
else:
    print('✗ Login failed:', login_response.status_code)

# Test 3: PDF Upload
print('\n📄 TEST 3: PDF Upload')
print('-' * 40)
pdf_data = base64.b64decode('JVBERi0xLjQKJeLjz9MNCjEgMCBvYmo8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PmVuZG9iagoyIDAgb2JqPDwvVHlwZS9QYWdlcy9LaWRzWzMgMCBSXS9Db3VudCAxPj5lbmRvYmoKMyAwIG9iajw8L1R5cGUvUGFnZS9QYXJlbnQgMiAwIFIvTWVkaWFCb3hbMCAwIDYxMiA3OTJdL0NvbnRlbnRzIDQgMCBSPj5lbmRvYmoKNCAwIG9iajw8L0xlbmd0aCA0ND4+c3RyZWFtCkJUCi9GMSA4IFRmCjUwIDc1MCBUZAooSGVsbG8gV29ybGQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDUKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNjkgMDAwMDAgbiAKMDAwMDAwMDE0MCAwMDAwMCBuIAowMDAwMDAwMjQyIDAwMDAwIG4gCnRyYWlsZXI8PC9TaXplIDUvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgozMzEKJSVFT0Y=')
with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as f:
    f.write(pdf_data)
    pdf_path = f.name

try:
    with open(pdf_path, 'rb') as f:
        upload_response = requests.post(
            'http://localhost:8000/api/reports/upload',
            files={'file': f},
            headers={'Authorization': 'Bearer ' + login_token}
        )
    
    if upload_response.status_code == 200:
        print('✓ PDF upload successful')
        report_id = upload_response.json().get('report_id')
        print('  Report ID:', report_id)
    else:
        print('✗ PDF upload failed:', upload_response.status_code)
finally:
    os.unlink(pdf_path)

# Test 4: Chat (Claude API key needed)
print('\n💬 TEST 4: Chat Endpoint')
print('-' * 40)
chat_response = requests.post(
    'http://localhost:8000/api/chat',
    json={'message': 'What should I know about my glucose levels?'},
    headers={'Authorization': 'Bearer ' + login_token}
)
if chat_response.status_code == 200:
    print('✓ Chat endpoint accessible')
    reply = chat_response.json().get('reply', 'No reply')
    if 'authentication_error' in reply or 'invalid' in reply.lower():
        print('  (Claude API key needed - update ANTHROPIC_API_KEY in .env)')
    else:
        print('  Reply:', reply[:100] + '...')
else:
    print('✗ Chat failed:', chat_response.status_code)

print('\n' + '=' * 50)
print('TESTS COMPLETE ✓')
print('=' * 50)
