import requests

BASE_URL = 'http://127.0.0.1:8000'

def change_batch_statuses():
    print("Changing batch statuses...")

    # Change batch1 (displayed as "0401 Part1") to review status
    print("\n1. Changing batch1 to review status...")
    update_data = {
        "status": "review"
    }
    response = requests.patch(f'{BASE_URL}/api/v1/batches/batch1', json=update_data)
    if response.status_code == 200:
        print("  batch1 updated to review status")
    else:
        print(f"Error: {response.status_code}")

    # Change batch2 to in_queue status
    print("\n2. Changing batch2 to in_queue status...")
    update_data = {
        "status": "in_queue"
    }
    response = requests.patch(f'{BASE_URL}/api/v1/batches/batch2', json=update_data)
    if response.status_code == 200:
        print("  batch2 updated to in_queue status")
    else:
        print(f"Error: {response.status_code}")

    # Verify changes
    print("\n3. Verifying changes...")
    response = requests.get(f'{BASE_URL}/api/v1/batches')
    if response.status_code == 200:
        batches = response.json()
        for batch in batches:
            print(f"  Batch {batch['id']}: Status={batch['status']}")
    else:
        print(f"Error: {response.status_code}")

if __name__ == "__main__":
    change_batch_statuses()