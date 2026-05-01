#  Model response to each endpoint in motor_router.py

# get_motor_ids
motor_ids_response = {
    200: {
        "description": "List of motor IDs in the database",
        "content": {
            "application/json": {
                "example": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            }
        },
    },

    404: {
        "description": "No motor IDs found",
        "content": {
            "application/json": {
                "example": {
                    "detail": "Failed to retrieve motor IDs from database"
                }
            }
        },
    },
}

# get_motor_data
motor_telemetry_response = {
    200: {
        "description": "Retrieve motor stats",
        "content": {
            "application/json": {
                "example":
                {
                    "timestamp": "2025-01-01T01:11:11",
                    "machine_id": 1,
                    "temperature": 40,
                    "vibration": 40,
                    "pressure": 4,
                    "energy_consumption": 1,
                    "machine_status": 1,
                    "anomaly_flag": 0
                }
            }
        },
    },
    404: {
        "description": "No motor data found for the specified ID",
        "content": {
            "application/json": {
                "example": {
                    "detail": "No data found for motor with ID: 1"
                }
            }
        },
    },
}
