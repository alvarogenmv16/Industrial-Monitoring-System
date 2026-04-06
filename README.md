# Industrial-Monitoring-System

A repo to build an industrial monitoring system for motors, collect data, and implement anomaly detection with dashboards and APIs.

## ⚙️ Industrial Motor Monitoring System (Python + FastAPI + SQLite)
A modern monitoring system for industrial motors that collects sensor data, stores it in a database, performs anomaly detection, triggers alerts, and exposes dashboards and endpoints via FastAPI.

This project is part of an industrial monitoring initiative focused on combining data acquisition, real-time analytics, and scalable architecture with Python best practices and clean project structure.

The data is coming from this dataset: https://www.kaggle.com/datasets/ziya07/smart-manufacturing-iot-cloud-monitoring-dataset/data

---

## 📊 About the Project
This system aims to provide a complete solution for monitoring industrial motors:

- Collect sensor data such as temperature, pressure, vibration...
- Store historical and real-time data in a SQLite database
- Implement anomaly detection to identify unusual behavior
- Trigger alerts when thresholds or anomalies are detected
- Expose dashboards and RESTful endpoints using FastAPI
- Enable analysis and reporting with pandas and SQL

The dashboard aims to provide visual representation for the different devices, and better comprehension of the data we are receiving

---

## 🛠 Tech Stack
- Python 3.11+
- FastAPI
- SQLite (for local data storage)
- Pandas (data analysis)
- Poetry (dependency management)
- Git & GitHub for version control

---

# 💡 Commit Structure
- 🚀 feat: New feature added to the project
- 🐛 fix: Bugfix
- ♻ refactor: Code improvements without changing functionality
- 📚 docs: Documentation changes
