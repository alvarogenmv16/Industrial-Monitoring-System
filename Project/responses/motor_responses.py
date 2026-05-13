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

# get_motors_status_overview
motors_status_overview_response = {
    200: {
        "description": "Retrieve operational overview for all motors",
        "content": {
            "application/json": {
                "example": {
                    "summary": {
                        "idle": 2,
                        "running": 7,
                        "failure": 1,
                        "idle_with_anomaly": 0,
                        "running_with_anomaly": 2,
                        "failure_with_anomaly": 1
                    },
                    "motors": [
                        {
                            "machine_id": "MOTOR_01",
                            "status": "running",
                            "anomaly": False
                        },
                        {
                            "machine_id": "MOTOR_02",
                            "status": "running",
                            "anomaly": True
                        },
                        {
                            "machine_id": "MOTOR_03",
                            "status": "failure",
                            "anomaly": True
                        }
                    ]
                }
            }
        },
    },

    404: {
        "description": "Failed to retrieve motors overview",
        "content": {
            "application/json": {
                "example": {
                    "detail": "Failed to retrieve motors overview."
                }
            }
        },
    },
}