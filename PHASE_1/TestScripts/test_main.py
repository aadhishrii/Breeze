from fastapi import FastAPI
from fastapi.testclient import TestClient

from API_SourceCode.main import app

client = TestClient(app)

#articles
def test_invalid_keyterm_valid_dates_article():
    params = {'start_date' : '2022-02-01T08:45:10', 'end_date' : '2022-03-01T19:37:12', 'location' : 'Spain' , 'keyterm': 'invalid'}
    response = client.get("/epiwatch-api/v1/article/search/", params)
    assert response.status_code == 404
    assert response.json() == {"error_type": "404 Not Found","error_description": "Keyterm was not found"}

def test_invalid_dates_valid_keyterm_article():
    params = {'start_date' : '02-01-2022T08:45:10', 'end_date' : '01-03-2022T19:37:12', 'location' : 'Spain' , 'keyterm': 'mosquito'}
    response = client.get("/epiwatch-api/v1/article/search/", params)
    assert response.status_code == 400
    assert response.json() == { "error_type": "400 Bad Request","error_description": "Start date and end date must be in correct format"}

def test_invalid_location_valid_keytermdates_article():
    params = {'start_date' : '2022-02-01T08:45:10', 'end_date' : '2022-03-01T19:37:12', 'location' : 'invalid' , 'keyterm': 'mosquito'}
    response = client.get("/epiwatch-api/v1/article/search/", params)
    assert response.status_code == 404
    assert response.json() == {"error_type": "404 Not Found","error_description": "Location search term was not found"}

def  test_valid_all_article():
    params = {'start_date' : '2022-02-01T08:45:10', 'end_date' : '2022-03-01T19:37:12', 'location' : 'Spain' , 'keyterm': 'mosquito'}
    response = client.get("/epiwatch-api/v1/article/search/", params)
    assert response.status_code == 200
    assert response.json() == {
    "url": "https://promedmail.org/",
    "headline": "Invasive mosquito",
    "main_text": "The Canary's Entomological Surveillance System has detected 2 larvae of the _Aedes aegypti_ mosquito on La Palma Island, but this is 'an isolated finding' and they do not have viruses that carry transmissible diseases, the Ministry of Health reported.",
    "date_of_publication": "2022-03-11T23:57:10",
    "keyword": [{"name": "mosquito"}],
    "reports": [{
      "disease": "deadly_mosquito_larvae",
      "syndrome": "???",
      "event_date": "2022-03-10-T16:28:00",
      "location": {"country": "Spain", "location": "La Palma Island"}
    }],
  }

def test_invalid_date_formats_1_article():
    params = {'start_date' : '20-2022-01T08:45:10', 'end_date' : '2022-03-01T19:37:12', 'location' : 'Spain' , 'keyterm': 'mosquito'}
    response = client.get("/epiwatch-api/v1/article/search/", params)
    assert response.status_code == 400
    assert response.json() == { "error_type": "400 Bad Request","error_description": "Start date and end date must be in correct format"}


def test_invalid_date_formats_2_article():
    params = {'start_date' : '2022-02-01T08:45:10', 'end_date' : '20-04-2022T19:37:12', 'location' : 'Spain' , 'keyterm': 'mosquito'}
    response = client.get("/epiwatch-api/v1/article/search/", params)
    assert response.status_code == 400
    assert response.json() == { "error_type": "400 Bad Request","error_description": "Start date and end date must be in correct format"}

def test_empty_start_date_article():
    params = {'start_date' : '', 'end_date' : '2022-03-01T19:37:12', 'location' : 'Spain' , 'keyterm': 'mosquito'}
    response = client.get("/epiwatch-api/v1/article/search/", params)
    assert response.status_code == 400
    assert response.json() == { "error_type": "400 Bad Request","error_description": "Start date and end date must be in correct format"}

def test_empty_end_date_article():
    params = {'start_date' : '2022-02-01T08:45:10', 'end_date' : '', 'location' : 'Spain' , 'keyterm': 'mosquito'}
    response = client.get("/epiwatch-api/v1/article/search/", params)
    assert response.status_code == 400
    assert response.json() == { "error_type": "400 Bad Request","error_description": "Start date and end date must be in correct format"}

def test_empty_start_date_end_date_article():
    params = {'start_date' : '', 'end_date' : '', 'location' : 'Spain' , 'keyterm': 'mosquito'}
    response = client.get("/epiwatch-api/v1/article/search/", params)
    assert response.status_code == 400
    assert response.json() == { "error_type": "400 Bad Request","error_description": "Start date and end date must be in correct format"}

def test_start_date_after_end_date_article():
    params = {'start_date' : '2022-03-01T08:45:10', 'end_date' : '2022-02-01T19:37:12', 'location' : 'Spain' , 'keyterm': 'mosquito'}
    response = client.get("/epiwatch-api/v1/article/search/", params)
    assert response.status_code == 400
    assert response.json() == { "error_type": "400 Bad Request","error_description": "Start date must be before the end date"}

def test_valid_parameters_no_articles():
    params = {'start_date' : '2022-03-01T08:45:10', 'end_date' : '2022-03-02T19:37:12', 'location' : 'United States' , 'keyterm': 'mosquito'}
    response = client.get("/epiwatch-api/v1/article/search/", params)
    assert response.status_code == 400
    assert response.json() == { "error_type": "400 Bad Request","error_description": "No articles found"}

def test_case_sensitive_location_article():
    params = {'start_date' : '2022-02-01T08:45:10', 'end_date' : '2022-03-01T19:37:12', 'location' : 'SpAiN' , 'keyterm': 'mosquito'}
    response = client.get("/epiwatch-api/v1/article/search/", params)
    assert response.status_code == 200
    assert response.json() == {
    "url": "https://promedmail.org/",
    "headline": "Invasive mosquito",
    "main_text": "The Canary's Entomological Surveillance System has detected 2 larvae of the _Aedes aegypti_ mosquito on La Palma Island, but this is 'an isolated finding' and they do not have viruses that carry transmissible diseases, the Ministry of Health reported.",
    "date_of_publication": "2022-03-11T23:57:10",
    "keyword": [{"name": "mosquito"}],
    "reports": [{
      "disease": "deadly_mosquito_larvae",
      "syndrome": "???",
      "event_date": "2022-03-10-T16:28:00",
      "location": {"country": "Spain", "location": "La Palma Island"}
    }],
  }

def test_case_sensitive_keyterm_article():
    params = {'start_date' : '2022-02-01T08:45:10', 'end_date' : '2022-03-01T19:37:12', 'location' : 'Spain' , 'keyterm': 'MOsQuIto'}
    response = client.get("/epiwatch-api/v1/article/search/", params)
    assert response.status_code == 200
    assert response.json() == {
    "url": "https://promedmail.org/",
    "headline": "Invasive mosquito",
    "main_text": "The Canary's Entomological Surveillance System has detected 2 larvae of the _Aedes aegypti_ mosquito on La Palma Island, but this is 'an isolated finding' and they do not have viruses that carry transmissible diseases, the Ministry of Health reported.",
    "date_of_publication": "2022-03-11T23:57:10",
    "keyword": [{"name": "mosquito"}],
    "reports": [{
      "disease": "deadly_mosquito_larvae",
      "syndrome": "???",
      "event_date": "2022-03-10-T16:28:00",
      "location": {"country": "Spain", "location": "La Palma Island"}
    }],
  }

def test_invalid_article_id():
    params = {'articleId': 00000}
    response = client.get("/epiwatch-api/v1/article/getArticleById/", params)
    assert response.status_code == 503
    assert response.json() == { "error_type": "503 Internal error","error_description": "Requested article Id has not been found"}

def test_valid_article_id():
    params = {'articleId': 123}
    response = client.get("/epiwatch-api/v1/article/getArticleById/", params)
    assert response.status_code == 200
    assert response.json() == {
    "url": "https://promedmail.org/",
    "headline": "Invasive mosquito",
    "main_text": "The Canary's Entomological Surveillance System has detected 2 larvae of the _Aedes aegypti_ mosquito on La Palma Island, but this is 'an isolated finding' and they do not have viruses that carry transmissible diseases, the Ministry of Health reported.",
    "date_of_publication": "2022-03-11T23:57:10",
    "keyword": [{"name": "mosquito"}],
    "reports": [{
      "disease": "deadly_mosquito_larvae",
      "syndrome": "???",
      "event_date": "2022-03-10-T16:28:00",
      "location": {"country": "Spain", "location": "La Palma Island"}
    }],
  }

   
#reports
def test_invalid_keyterm_valid_dates_report():
    params = {'start_date' : '2022-02-01T08:45:10', 'end_date' : '2022-03-01T19:37:12', 'location' : 'Spain' , 'keyterm': 'invalid'}
    response = client.get("/epiwatch-api/v1/report/search/", params)
    assert response.status_code == 404
    assert response.json() == {"error_type": "404 Not Found","error_description": "Keyterm was not found"}

def test_invalid_dates_valid_keyterm_report():
    params = {'start_date' : '02-01-2022T08:45:10', 'end_date' : '01-03-2022T19:37:12', 'location' : 'Spain' , 'keyterm': 'mosquito'}
    response = client.get("/epiwatch-api/v1/report/search/", params)
    assert response.status_code == 400
    assert response.json() == { "error_type": "400 Bad Request","error_description": "Start date and end date must be in correct format"}

def test_invalid_location_valid_keytermdates_report():
    params = {'start_date' : '2022-02-01T08:45:10', 'end_date' : '2022-03-01T19:37:12', 'location' : 'invalid' , 'keyterm': 'mosquito'}
    response = client.get("/epiwatch-api/v1/report/search/", params)
    assert response.status_code == 404
    assert response.json() == {"error_type": "404 Not Found","error_description": "Location search term was not found"}

def  test_valid_all_report():
    params = {'start_date' : '2022-02-01T08:45:10', 'end_date' : '2022-03-01T19:37:12', 'location' : 'Spain' , 'keyterm': 'mosquito'}
    response = client.get("/epiwatch-api/v1/report/search/", params)
    assert response.status_code == 200
    assert response.json() == {
    "disease": "deadly_mosquito_larvae",
    "syndrome": "???",
    "event_date": "2022-03-10-T16:28:00",
    "location": {"country": "Spain", "location": "La Palma Island"}
  }

def test_invalid_date_formats_1_report():
    params = {'start_date' : '20-2022-01T08:45:10', 'end_date' : '2022-03-01T19:37:12', 'location' : 'Spain' , 'keyterm': 'mosquito'}
    response = client.get("/epiwatch-api/v1/report/search/", params)
    assert response.status_code == 400
    assert response.json() == { "error_type": "400 Bad Request","error_description": "Start date and end date must be in correct format"}


def test_invalid_date_formats_2_report():
    params = {'start_date' : '2022-02-01T08:45:10', 'end_date' : '20-04-2022T19:37:12', 'location' : 'Spain' , 'keyterm': 'mosquito'}
    response = client.get("/epiwatch-api/v1/report/search/", params)
    assert response.status_code == 400
    assert response.json() == { "error_type": "400 Bad Request","error_description": "Start date and end date must be in correct format"}

def test_empty_start_date_report():
    params = {'start_date' : '', 'end_date' : '2022-03-01T19:37:12', 'location' : 'Spain' , 'keyterm': 'mosquito'}
    response = client.get("/epiwatch-api/v1/report/search/", params)
    assert response.status_code == 400
    assert response.json() == { "error_type": "400 Bad Request","error_description": "Start date and end date must be in correct format"}

def test_empty_end_date_report():
    params = {'start_date' : '2022-02-01T08:45:10', 'end_date' : '', 'location' : 'Spain' , 'keyterm': 'mosquito'}
    response = client.get("/epiwatch-api/v1/report/search/", params)
    assert response.status_code == 400
    assert response.json() == { "error_type": "400 Bad Request","error_description": "Start date and end date must be in correct format"}

def test_empty_start_date_end_date_report():
    params = {'start_date' : '', 'end_date' : '', 'location' : 'Spain' , 'keyterm': 'mosquito'}
    response = client.get("/epiwatch-api/v1/report/search/", params)
    assert response.status_code == 400
    assert response.json() == { "error_type": "400 Bad Request","error_description": "Start date and end date must be in correct format"}

def test_start_date_after_end_date_report():
    params = {'start_date' : '2022-03-01T08:45:10', 'end_date' : '2022-02-01T19:37:12', 'location' : 'Spain' , 'keyterm': 'mosquito'}
    response = client.get("/epiwatch-api/v1/report/search/", params)
    assert response.status_code == 400
    assert response.json() == { "error_type": "400 Bad Request","error_description": "Start date must be before the end date"}

def test_valid_parameters_no_report():
    params = {'start_date' : '2022-03-01T08:45:10', 'end_date' : '2022-03-02T19:37:12', 'location' : 'United States' , 'keyterm': 'mosquito'}
    response = client.get("/epiwatch-api/v1/report/search/", params)
    assert response.status_code == 400
    assert response.json() == { "error_type": "400 Bad Request","error_description": "No articles found"}

def test_case_sensitive_location_report():
    params = {'start_date' : '2022-02-01T08:45:10', 'end_date' : '2022-03-01T19:37:12', 'location' : 'SpAiN' , 'keyterm': 'mosquito'}
    response = client.get("/epiwatch-api/v1/report/search/", params)
    assert response.status_code == 200
    assert response.json() == {
    "disease": "deadly_mosquito_larvae",
    "syndrome": "???",
    "event_date": "2022-03-10-T16:28:00",
    "location": {"country": "Spain", "location": "La Palma Island"}
  }

def test_case_sensitive_keyterm_report():
    params = {'start_date' : '2022-02-01T08:45:10', 'end_date' : '2022-03-01T19:37:12', 'location' : 'Spain' , 'keyterm': 'MOsQuIto'}
    response = client.get("/epiwatch-api/v1/report/search/", params)
    assert response.status_code == 200
    assert response.json() == {
    "disease": "deadly_mosquito_larvae",
    "syndrome": "???",
    "event_date": "2022-03-10-T16:28:00",
    "location": {"country": "Spain", "location": "La Palma Island"}
  }

def test_invalid_report_id():
    params = {'reportId': 00000}
    response = client.get("/epiwatch-api/v1/report/getReportById/", params)
    assert response.status_code == 503
    assert response.json() == { "error_type": "503 Internal error","error_description": "Requested report Id has not been found"}

def test_valid_report_id():
    params = {'reportId': 123}
    response = client.get("/epiwatch-api/v1/report/getReportById/", params)
    assert response.status_code == 200
    assert response.json() == {
    "disease": "deadly_mosquito_larvae",
    "syndrome": "???",
    "event_date": "2022-03-10-T16:28:00",
    "location": {"country": "Spain", "location": "La Palma Island"}
  }

