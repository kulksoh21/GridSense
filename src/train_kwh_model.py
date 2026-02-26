# train_kwh_model.py
import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split, RandomizedSearchCV, cross_val_score
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error

# 1️⃣ Load data
df = pd.read_csv("simulated_energy_data.csv")

# 2️⃣ Feature engineering
df["appliance_count"] = df[["fridge","washer","dryer","dishwasher","ev_charger","pool_pump"]].sum(axis=1)
df["residents_per_sqft"] = df["residents"] / df["home_size_sqft"]
df["hvac_intensity"] = df["home_size_sqft"] * df["residents"]
df["has_ev_or_pool"] = ((df["ev_charger"]==1)|(df["pool_pump"]==1)).astype(int)

# 3️⃣ Define features
target = "bill_usd"
categorical_features = ["ac_level", "climate", "time_usage_type"]
numeric_features = ["home_size_sqft","residents","total_kwh","carbon_kg",
                    "appliance_count","residents_per_sqft","hvac_intensity","has_ev_or_pool"]

X = df[categorical_features + numeric_features]
y = df[target]

# 4️⃣ Preprocessing
preprocessor = ColumnTransformer([
    ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
    ("num", StandardScaler(), numeric_features)
])

# 5️⃣ Model & pipeline
model = GradientBoostingRegressor(random_state=42)
pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("regressor", model)
])

# 6️⃣ Train/test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 7️⃣ Hyperparameter tuning
param_dist = {
    "regressor__n_estimators": [200,300,400],
    "regressor__learning_rate": [0.01,0.03,0.05],
    "regressor__max_depth": [3,4,5],
    "regressor__min_samples_split": [2,5,10],
    "regressor__min_samples_leaf": [1,2,4],
    "regressor__subsample": [0.8,0.9,1.0]
}

search = RandomizedSearchCV(
    pipeline, param_distributions=param_dist, n_iter=25, cv=5,
    scoring="r2", verbose=1, n_jobs=-1, random_state=42
)

search.fit(X_train, y_train)
best_model = search.best_estimator_
print("✅ Best Parameters:", search.best_params_)

# 8️⃣ Test performance
y_pred = best_model.predict(X_test)
print("\n📊 TEST METRICS")
print("R²   :", round(r2_score(y_test,y_pred),4))
print("RMSE :", round(np.sqrt(mean_squared_error(y_test,y_pred)),2))
print("MAE  :", round(mean_absolute_error(y_test,y_pred),2))

# 9️⃣ Cross-validation
cv_scores = cross_val_score(best_model, X, y, cv=5, scoring="r2")
print("\n🔹 Cross-Validation")
print("R² CV Mean :", round(cv_scores.mean(),4))
print("R² CV Std  :", round(cv_scores.std(),4))

# 🔟 Feature importance
feature_names = best_model.named_steps["preprocessor"].get_feature_names_out()
importances = best_model.named_steps["regressor"].feature_importances_
importance_df = pd.DataFrame({"Feature":feature_names,"Importance":importances}).sort_values(by="Importance",ascending=False)
print("\n🔥 Top 15 Features")
print(importance_df.head(15))

# 1️⃣1️⃣ Save model
joblib.dump(best_model, "best_energy_model.pkl")
print("\n💾 Model saved as best_energy_model.pkl")