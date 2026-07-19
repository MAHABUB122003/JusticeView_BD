"""
Train the WAF ML model from your dataset.
Usage: python train_model.py
"""
import pandas as pd
import numpy as np
import joblib
import os
import sys
import warnings
warnings.filterwarnings('ignore')

sys.path.insert(0, os.path.dirname(__file__))
from src.engine.feature_engineer import WAFFeatureEngineer

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, f1_score

def train():
    dataset_path = os.getenv('DATASET_PATH', '../web_application_firewall_best.csv')
    model_dir = os.getenv('MODEL_DIR', './models')
    os.makedirs(model_dir, exist_ok=True)

    print(f"Loading dataset: {dataset_path}")
    df = pd.read_csv(dataset_path)
    print(f"Dataset loaded: {len(df)} samples, columns: {df.columns.tolist()}")
    print(f"Class distribution:\n{df['label_binary'].value_counts()}")

    print("Extracting features...")
    engineer = WAFFeatureEngineer()
    feature_list = []
    for idx, text in enumerate(df['text']):
        if idx % 5000 == 0:
            print(f"  Processing {idx}/{len(df)}")
        feature_list.append(engineer.extract_features(text))

    feature_df = pd.DataFrame(feature_list)
    print(f"Extracted {feature_df.shape[1]} features")

    X = feature_df.values
    y = df['label_binary'].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    print("Training RandomForest model...")
    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=12,
        min_samples_split=10,
        min_samples_leaf=5,
        max_features='sqrt',
        class_weight='balanced',
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train_scaled, y_train)

    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    print(f"\nModel Performance:")
    print(f"  Accuracy: {accuracy:.4f}")
    print(f"  F1 Score: {f1:.4f}")
    print(f"\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['Normal', 'Attack']))

    model_path = os.path.join(model_dir, 'waf_model.pkl')
    scaler_path = os.path.join(model_dir, 'scaler.pkl')
    features_path = os.path.join(model_dir, 'feature_columns.pkl')

    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    joblib.dump(feature_df.columns.tolist(), features_path)
    joblib.dump(engineer, os.path.join(model_dir, 'feature_engineer.pkl'))

    print(f"\nModels saved to {model_dir}/")
    print(f"  - waf_model.pkl")
    print(f"  - scaler.pkl")
    print(f"  - feature_columns.pkl")
    print(f"  - feature_engineer.pkl")
    print("\nTraining complete!")


if __name__ == '__main__':
    train()
