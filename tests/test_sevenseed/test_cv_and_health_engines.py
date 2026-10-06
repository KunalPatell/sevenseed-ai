# -*- coding: utf-8 -*-
"""
Tests for Breakdown Factor Computer Vision Engine (best.tflite / best.onnx)
and Decode Forest Pharmacy Healthcare Intelligence Engine.
"""
import os
import sys
import pytest
import numpy as np
from fastapi.testclient import TestClient

backend_dir = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "..", "apps", "sevenseed", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import cv_engine
import health_engine
from main import app

client = TestClient(app)


def test_cv_engine_model_info():
    info = cv_engine.get_model_info()
    assert info['status'] == 'ready'
    assert 'models' in info
    assert 'tflite' in info['models']
    assert 'onnx' in info['models']
    assert info['models']['tflite']['available'] is True
    assert info['models']['onnx']['available'] is True
    assert len(info['classes']) == 10
    assert 'IS 456:2000' in info['standards']


def test_cv_engine_presets():
    for pid in ['wall_crack', 'pipe_burst', 'switch_hazard', 'tile_spall']:
        res = cv_engine.detect_damage(b'', sample_id=pid)
        assert res['status'] == 'success'
        assert len(res['detections']) >= 1
        det = res['detections'][0]
        assert det['confidence'] >= 0.85
        assert 'is_code' in det
        assert 'treatment' in det
        assert res['boq_takeoff']['total_estimated_inr'] > 0


def test_cv_engine_dual_inference():
    # Test tflite interpreter directly with synthetic image
    interp, in_det, out_det = cv_engine.get_tflite_interpreter()
    assert interp is not None
    dummy_tf = np.full((1, 640, 640, 3), 0.5, dtype=np.float32)
    interp.set_tensor(in_det[0]['index'], dummy_tf)
    interp.invoke()
    tf_out = interp.get_tensor(out_det[0]['index'])
    assert tf_out.shape == (1, 6, 8400)

    # Test ONNX session directly
    onnx_sess, onnx_in, onnx_out = cv_engine.get_session()
    assert onnx_sess is not None
    dummy_onnx = np.full((1, 3, 640, 640), 0.5, dtype=np.float32)
    onnx_res = onnx_sess.run([onnx_out], {onnx_in: dummy_onnx})[0]
    assert onnx_res.shape == (1, 14, 8400)


def test_cv_engine_boq_calculation():
    res = cv_engine.detect_damage(b'', sample_id='wall_crack')
    boq = res['boq_takeoff']
    subtotal = boq['base_materials_labor_inr']
    scaffold = boq['scaffolding_safety_inr']
    gst = boq['gst_18_inr']
    total = boq['total_estimated_inr']
    assert scaffold == 1600
    assert gst == round((subtotal + scaffold) * 0.18)
    assert total == subtotal + scaffold + gst


def test_health_engine_generics():
    results = health_engine.search_generic_medicines('augmentin')
    assert len(results) >= 1
    m = results[0]
    assert 'Amoxicillin' in m['generic_name']
    assert m['savings_pct'] >= 70
    assert m['pmbjp_code'] != ''


def test_health_engine_interactions():
    res = health_engine.check_drug_interactions(['aspirin', 'warfarin'])
    assert res['status'] == 'interaction_flagged'
    assert res['interaction_count'] >= 1
    assert res['highest_severity'] in ['CRITICAL', 'MAJOR']
    assert 'bleeding' in res['interactions'][0]['clinical_effect'].lower()


def test_health_emergency_directory():
    directory = health_engine.get_emergency_directory('Ahmedabad')
    assert directory['city'] == 'Ahmedabad'
    assert len(directory['hospitals']) >= 1
    assert 'emergency_24x7' in directory['hospitals'][0]


def test_api_endpoints():
    # 1. Model info
    r1 = client.get('/api/breakdown/model-info')
    assert r1.status_code == 200
    assert r1.json()['status'] == 'ready'

    # 2. Damage detection
    r2 = client.post('/api/breakdown/detect', json={'sample_id': 'switch_hazard', 'engine': 'tflite'})
    assert r2.status_code == 200
    assert r2.json()['detections'][0]['class_name'] == 'switch_damage'

    # 3. Generic medicines
    r3 = client.get('/api/health/generics?q=paracetamol')
    assert r3.status_code == 200
    assert len(r3.json()['results']) >= 1

    # 4. Drug interactions
    r4 = client.post('/api/health/interactions', json={'drugs': ['aspirin', 'warfarin']})
    assert r4.status_code == 200
    assert r4.json()['interaction_count'] >= 1

    # 5. Emergency directory
    r5 = client.get('/api/health/emergency-directory?city=Ahmedabad')
    assert r5.status_code == 200
    assert len(r5.json()['hospitals']) >= 1

    # 6. Prescription parse
    r6 = client.post('/api/health/prescription-parse', json={'raw_text': 'Tab Augmentin 625 Duo, Tab Pantocid 40mg'})
    assert r6.status_code == 200
    assert r6.json()['status'] == 'success'
    assert len(r6.json()['meds']) >= 2

    # 7. Resume match
    r7 = client.post('/api/recruitment/resume-match', json={
        'job_description': 'Senior Python, FastAPI, Docker, and Kubernetes Engineer',
        'resume_text': 'Full stack developer with extensive Python and Docker experience'
    })
    assert r7.status_code == 200
    assert r7.json()['status'] == 'success'
    assert 'Python' in r7.json()['matched_skills']
    assert 'Fastapi' in r7.json()['missing_skills'] or 'Kubernetes' in r7.json()['missing_skills']
