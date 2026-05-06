import requests
import json

BASE_URL = 'http://127.0.0.1:8000'

def test_backend_updates():
    print("Testing backend data updates and frontend reflection...")

    # 1. Get current batches
    print("\n1. Current batches from backend:")
    response = requests.get(f'{BASE_URL}/api/v1/batches')
    if response.status_code == 200:
        batches = response.json()
        for batch in batches:
            print(f"  Batch {batch['id']}: Status={batch['status']}, Completed={batch['completed_calls']}/{batch['total_calls']}")
    else:
        print(f"Error: {response.status_code}")

    # 2. Update batch1 status to completed
    print("\n2. Updating batch1 to completed status...")
    update_data = {
        "status": "completed",
        "completed_calls": 10
    }
    response = requests.patch(f'{BASE_URL}/api/v1/batches/batch1', json=update_data)
    if response.status_code == 200:
        updated_batch = response.json()
        print(f"  Updated batch1: Status={updated_batch['status']}, Completed={updated_batch['completed_calls']}/{updated_batch['total_calls']}")
    else:
        print(f"Error updating batch: {response.status_code}")

    # 3. Verify the update
    print("\n3. Verifying update - fetching batches again:")
    response = requests.get(f'{BASE_URL}/api/v1/batches')
    if response.status_code == 200:
        batches = response.json()
        for batch in batches:
            print(f"  Batch {batch['id']}: Status={batch['status']}, Completed={batch['completed_calls']}/{batch['total_calls']}")
    else:
        print(f"Error: {response.status_code}")

    print("\n4. Frontend should now show:")
    print("  - Total Batches: 2")
    print("  - In Queue: 0")
    print("  - Review Required: 1 (calls with denial reasons)")
    print("  - Completed: 2 (both batches now completed)")
    print("  - Active batch progress: None (no more in_progress batches)")

    # 4. Update back to in_progress
    print("\n5. Changing batch1 back to in_progress for demonstration...")
    update_data = {
        "status": "in_progress",
        "completed_calls": 8
    }
    response = requests.patch(f'{BASE_URL}/api/v1/batches/batch1', json=update_data)
    if response.status_code == 200:
        print("  batch1 reset to in_progress with 8/10 calls completed")
    else:
        print(f"Error: {response.status_code}")

if __name__ == "__main__":
    test_backend_updates()