"""
Predictions API Route
======================
Endpoints:
  GET  /api/predictions/status      → model status + accuracy
  POST /api/predictions/train       → train/retrain from all DB history
  POST /api/predictions/predict     → rich prediction for one matchup
  GET  /api/predictions/upcoming    → predict all upcoming fixtures
  GET  /api/predictions/fixtures    → list upcoming fixtures to pick from
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from database import get_connection
import ml.prediction_engine as engine

router = APIRouter()


# ─── Request models ───────────────────────────────────────────────────────────

class TrainRequest(BaseModel):
    """Optional filters for targeted retraining (defaults to all data)."""
    league_id:  Optional[int] = None   # reserved for future fine-grained training
    season_id:  Optional[int] = None


class PredictRequest(BaseModel):
    home_team_id: int
    away_team_id: int
    league_id:    int
    season_id:    int


# ─── Routes ───────────────────────────────────────────────────────────────────

@router.get("/status")
def prediction_status():
    """
    Return current model status: is it trained, accuracy, how many matches
    it was trained on, number of features used.
    """
    return engine.get_status()


@router.post("/train")
def train(req: TrainRequest = None):
    """
    Train (or retrain) the prediction model on all completed matches in the DB.
    This may take 30-120 seconds depending on data size.
    Training runs cross-validation and returns CV accuracy.
    """
    try:
        result = engine.train_model()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/predict")
def predict(req: PredictRequest):
    """
    Predict the outcome of a specific match.
    Returns full rich output: probabilities, expected goals, key factors,
    H2H history, team comparison, and top feature importances.
    """
    if req.home_team_id == req.away_team_id:
        raise HTTPException(status_code=400, detail="Home and away teams must be different.")
    try:
        result = engine.predict_match(
            req.home_team_id,
            req.away_team_id,
            req.league_id,
            req.season_id,
        )
        if "error" in result:
            raise HTTPException(status_code=503, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/upcoming")
def upcoming_predictions(
    league_id: Optional[int] = Query(None, description="Filter by league ID"),
    limit:     int           = Query(50,   description="Max fixtures to predict"),
):
    """
    Predict all upcoming unplayed fixtures (match_date >= today).
    Returns rich predictions for each, ordered by match date ascending.
    Optionally filter by league_id.
    """
    try:
        results = engine.predict_upcoming(league_id=league_id, limit=limit)
        return {
            "count":       len(results),
            "predictions": results,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/fixtures")
def list_upcoming_fixtures(
    league_id:  Optional[int] = Query(None),
    season_id:  Optional[int] = Query(None),
    limit:      int           = Query(100),
):
    """
    List upcoming unplayed fixtures with team names and league info.
    Use this to discover team IDs before calling /predict.
    """
    conn = get_connection()
    cur  = conn.cursor()
    try:
        query = """
            SELECT m.id, m.match_date, m.gameweek, m.start_time,
                   ht.id AS home_team_id, ht.name AS home_team,
                   at.id AS away_team_id, at.name AS away_team,
                   l.id  AS league_id,   l.name  AS league,
                   s.id  AS season_id,   s.name  AS season
            FROM matches m
            JOIN teams   ht ON ht.id = m.home_team_id
            JOIN teams   at ON at.id = m.away_team_id
            JOIN leagues l  ON l.id  = m.league_id
            JOIN seasons s  ON s.id  = m.season_id
            WHERE m.home_score IS NULL
              AND m.match_date >= CURRENT_DATE
        """
        params = []
        if league_id:
            query += " AND m.league_id = %s"; params.append(league_id)
        if season_id:
            query += " AND m.season_id = %s"; params.append(season_id)
        query += " ORDER BY m.match_date ASC LIMIT %s"
        params.append(limit)

        cur.execute(query, params)
        rows = cur.fetchall()
        return {
            "count":    len(rows),
            "fixtures": [dict(r) for r in rows],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()