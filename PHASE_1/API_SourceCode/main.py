from dataclasses import dataclass
from sre_constants import RANGE
import string
from fastapi import FastAPI, Request
from fastapi.openapi.utils import get_openapi
import json
import psycopg2
from datetime import datetime
from utilities import validateTimePeriod, keyTerms, validateLocation, testFunction
#from temp_db_articles import dbGetArticleIds, testFunction2
from temp_db_articles import dbGetArticleIds
from YelpAPI import apiKey
import requests
from fetchData import df
from typing import Optional
from pydantic import BaseModel
from pandaUtils import getCurrentCases, getHistoricalData
from populationData.populationByPostcode import populationData
#import pandas as pd

#df = pd.read_csv('downloaded.csv')


# CORS middleware
from fastapi.middleware.cors import CORSMiddleware
origins = ["*"]



# Define API key, define the endpoint, define the header
API_KEY = apiKey
ENDPOINT = 'https://api.yelp.com/v3/businesses/search'
HEADERS = {'Authorization': 'bearer %s' % API_KEY}

# Define parameters
PARAMETERS = {
  'term':'coffee',
  'limit':50,
  'radius':10000,
  'offset':50,
  'location':'San Diego'
}

# Make a request to the Yelp API




#db = psycopg2.connect(host="localhost", database="epiwatch", user="epiwatch", password="135246")

logFile="epiwatch.log"

app = FastAPI()


app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)

@app.middleware("http")
async def logEndpointUse(request: Request, call_next):
  requestTime = datetime.now()
  response = await call_next(request)
  with open(logFile, "a") as log:
    log.write(f"{requestTime}: {request.url.path} {response.status_code}\n")
  return response

@app.get("/")
async def root():
  return {"message": "Hello World"}

@app.get("/healthcheck")
async def root():
  return {"message": "Epiwatch Galaxy Team up and running"}

@app.get("/riskAssessment")
async def getCovidCaseByPostcode(postcode):
  print('data request recieved: ', postcode)
  #response = requests.get(url = ENDPOINT, params = PARAMETERS, headers = HEADERS)
  #print("response: ", response)
  # then we have the csv_file
  # return a list of all cases in the current day
  currentCases = getCurrentCases(postcode)
  # return a list of all cases in the past/date to case number
  #historicalData = getHistoricalData(postcode)
  historicalData = getHistoricalData(postcode)

  # population related data
  totalCasesByPostcode =  sum(case['confirmed_cases_count'] for case in historicalData)
  totalPostcodePopulation = populationData[postcode]
  returnPopulationInfo = [totalCasesByPostcode, totalPostcodePopulation]

  print(returnPopulationInfo)

  data = [
    currentCases, 
    historicalData,
    returnPopulationInfo
  ]
  
  return data

def getNearbyPostcodeData(postcode):
  url = f"http://api.beliefmedia.com/postcodes/near/{postcode}.json"
  r = requests.get(url = url)
  json = r.json()
  data = {"results": [], "code": 200}

  if json['code'] == "404":
    data["code"] = 404
    return data

  for x in json['results']:
    location = {
      "postcode": x['postcode'],
      "latitude": x['latitude'],
      "longitude": x['longitude'],
    }

    if location not in data["results"]:
      data["results"].append(location)

  return data

def getGeolocation(postcode):
  url = f"https://digitalapi.auspost.com.au/locations/v2/points/postcode/{postcode}?types=R_SPB"
  r = requests.get(url = url, headers={"AUTH-KEY": '2WNL7B5bO7AGeE6T4OU0Ycf7TdXzDXy6'})
  json = r.json()

  data = json['points']

  if len(data) == 0:
    return []
  
  return data[0]["geo_location"]

def getNearbyPostCodes(lat, long):
  url = f"https://digitalapi.auspost.com.au/locations/v2/points/geo/{long}/{lat}?radius=10&types=R_SPB&limit=100"
  r = requests.get(url = url, headers={"AUTH-KEY": '2WNL7B5bO7AGeE6T4OU0Ycf7TdXzDXy6'})
  json = r.json()
  data = json['points']

  results = []
  postcodes = []
  for result in data:
    if result['geo_location']['distance'] != 0:
      postcode = result["address"]["postcode"]
      if postcode not in postcodes:
        postcodes.append(postcode)
        results.append({
          "postcode": postcode,
          "latitude": result['geo_location']['lat'],
          "longitude": result['geo_location']['lon'],
        })

  return results
  

@app.get("/getnearbyCovidCaseByPostcode")
async def getnearbyCovidCaseByPostcode(postcode):
  
  data = getGeolocation(postcode)

  if len(data) == 0:
    return data

  nearbyPostcodes = getNearbyPostCodes(data["lat"], data["lon"])

  filteredData = []
  for area in nearbyPostcodes:
    cases = getCurrentCases(area['postcode'])['confirmed_cases_count']
    if (len(cases) != 0):
      filteredData.append({
          "postcode": area['postcode'],
          "latitude": area['latitude'],
          "longitude": area['longitude'],
          "cases": cases[0],
      })

  return filteredData

class Event(BaseModel):
  title : str
  owner : str
  description : Optional[str] = None
  address : Optional[str] = None
  postcode : Optional[str] = None # dddd e.g 2042
  date : Optional[str] = None # yyy-mm-dd
  time : Optional[str] = None # dd:dd e.g 0:45
  capacity : Optional[str] = None
  venueType : Optional[str] = None
  exposure : Optional[str] = None
  itinerary : Optional[int] = None
  backupEvent : Optional[int] = None

  def __getitem__(self, item):
    return getattr(self,item)

@app.post("/createEvent")
async def createEvent(info : Event):
  # query = "insert into events(title, owner, description, location, postcode, date, time, capacity, venueType, environment, backupid) values (%s, 1, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
  # cur = db.cursor()
  # try:
  #   cur.execute(query, [info["title"], info["description"], info["address"], info["postcode"], info["date"], info["time"], info["capacity"], info["venueType"], info["exposure"], info["backupEvent"]])
  # except:
  #   cur.execute("ROLLBACK")
  #   return {
  #     "status": "ERROR",
  #     "data": info
  #   }
  # db.commit()
  # cur.close()
  # return {
      # "status" : "SUCCESS",
      # "data" : info
  # }
  return {
    "status" : "SUCCESS",
    "data" : info,
    "id": 1
  }

@app.get("/getEventData")
def getEventData(id):
#   cur = db.cursor()

#   queryevent = "select * from events where id=%s"

#   cur.execute(queryevent, [id])

#   eventdata = cur.fetchone()

#   if eventdata == None:
#     return {
#       "status": "ERROR",
#       "description": "Event not found with id",
#       "id": id
#     }

#   eid, owner, description, date, location, postcode, venuetype, environment, itineraryid, backupid, capacity, time, title = eventdata

#   querygoing = "select (profiles.id, profiles.email, profiles.name) from event_attendance join profiles on (event_attendance.profile = profiles.id) where event_attendance.event=%s"

#   cur.execute(querygoing, [id])

#   goingProfiles = []

#   goingdata = cur.fetchall()

#   for goings in goingdata:
#     id, email, name = goings
#     goingProfiles.append({
#       "key": id,
#       "email": email,
#       "name": name
#     })

#   '''f = open('data.json')
#   data = json.load(f)

#   events = data['events']
#   itineraries = data['itineraries']
#   profiles = data['profiles']

#   eventData = {}
#   for e in events:
#     if e['id'] == id:
#       eventData = e

#   goingProfiles = []
#   for g in eventData['going']:
#     for p in profiles:
#       if g == p['id']:
#         goingProfiles.append({
#           "email": p['email'],
#           "key": g,
#           "name": p['fname'],
#           "href": "#"
#         })

#   itineraryData = {}
#   if eventData['itineraryId']:
#     for i in itineraries:
#       if i['id'] == eventData['itineraryId']:
#         itineraryData = {
#           "title": i['title'],
#           "info": i['startDate'] + ' - ' + i['endDate'] + ' ' + i['location']
#         }
# '''
  # return {
  #   "id": eid,
  #   "title": title,
  #   "location": location,
  #   "date": date,
  #   "description": description,
  #   "venueType": venuetype,
  #   "itinerary": {},
  #   "backupId": backupid,
  #   "going": goingProfiles,
  #   "isPublic": True
  # }
  return {
    "id": 1,
    "title": "Sydney Royal Easter Show",
    "location": '123 Alice st Newtown, NSW',
    "postcode": '2042',
    "date": '19/04/2022',
    "description": "First held in 1823, the Sydney Royal Easter Show is Australia's largest annual ticketed event, attracting over 828,000 attendees on average. The Show is a celebration of Australian culture, from our rural traditions to our modern day lifestyles, providing unique experiences for everyone. Revenue generated by it allows the RAS to invest in agricultural programs, competitions, education, youth and rural NSW.",
    "venueType": 'Public',
    "exposure": 'Both',
    "itinerary": 1,
    "capacity": 24000,
    "backupId": '2',
    "going": ['1'],
    "isPublic": False
  }


@app.get("/getEventIds")
def getEventIds():

  ids = ['1', '2']

  return ids

@app.get("/getItineraryIds")
def getItineraryIds():

  ids = ['1', '2']
  return ids

class Itinerary(BaseModel):
  title : str
  description : Optional[str] = None
  destination : Optional[str] = None
  departingFrom : Optional[str] = None # dddd e.g 2042
  startDate : Optional[str] = None # yyy-mm-dd
  endDate : Optional[str] = None # dd:dd e.g 0:45

@app.post("/createItinerary")
def createItinerary(info : Itinerary):
    return {
      "status" : "SUCCESS",
      "id": 1
  }

@app.get("/getItineraryData")
def getItineraryData(id):
  # query and return data for this itinerary
  return {
    'id': 1,
    'title': "F1 Trip",
    'startDate': "8/2/2022",
    'endDate': "12/2/2022",
    'description': "Trip to melbourne to see the F1",
    'destination': "Melbourne, Australia",
    'departingFrom': "Sydney, Australia"
  }

@app.get("/getEventAttendees")
def getEventAttendees(id):
  # return list of profile objects
  return [
  ]

@app.post("/addEventAttendee")
def addEventAttendee(id, email):
  # return new list of attendee profile objects
  return [
    {
      'id': 1,
      'email': 'willdahl1@gmail.com',
      'image': "https://lh3.googleusercontent.com/a-/AOh14Gjh_x3DCBhVidAY5fSfb0KmAZRCUwAmX90igjYxAg=s96-c",
      'name': 'William Dahl',
      'vaccination': 2
    }
  ]

@app.get("/getItineraryAttendees")
def getItineraryAttendees(id):
  # return list of profile objects
  return [
    {
      'id': 1,
      'email': 'willdahl1@gmail.com',
      'image': "https://lh3.googleusercontent.com/a-/AOh14Gjh_x3DCBhVidAY5fSfb0KmAZRCUwAmX90igjYxAg=s96-c",
      'name': 'William Dahl',
      'vaccination': 2
    }
  ]

@app.get("/getEventsInItinerary")
def getEventsInItinerary(id):
  # return list of event objects within specified itinerary id
  return [
    {
      'id': 1,
      'title': "Race day",
      'date': "10 Feb",
      'location': "Albert Park Grand Prix Circuit",
      'itinerary': 1,
      'risk': "moderate",
    },
    {
      'id': 2,
      'title': "Night out",
      'date': "19 April",
      'location': "Ivy Precint, Sydney",
      'itinerary': 1,
      'risk': "high",
    },
  ]

@app.get("/getUserEvents")
def getUserEvents(id):
  # return list of event objects owned by user
  return [
    {
      'id': 1,
      'title': "Race day",
      'date': "10/04/2022",
      'location': "Albert Park Grand Prix Circuit",
      'itinerary': 1,
      'risk': "moderate",
    },
    {
      'id': 2,
      'title': "Clubbing with the boyz",
      'date': "9/04/2022",
      'location': "D2, Chapel St, Melbourne",
      'itinerary': 1,
      'risk': "high",
    },
    {
      'id': 3,
      'title': "House party",
      'date': "24/04/2022",
      'location': "Newtown, Sydney",
      'risk': "low",
    }
  ]

@app.get("/getUserItineraries")
def getUserItineraries(id):
  # return list of itineraries owned by user
  return [
    {
      'id': 1,
      'title': "F1 Trip",
      'startDate': "8/4/2022",
      'endDate': "12/4/2022",
      'description': "Trip to melbourne to see the F1",
      'destination': "Melbourne, Australia",
      'departingFrom': "Sydney, Australia"
    }
  ]

# @app.get("/createProfile")
# def createProfile(email, name, vaccination):
#   # query and return data for this itinerary
#   query = "insert into profiles(email, name, vaccination) values (%s, %s, %s);"
#   cur = db.cursor()
#   cur.execute(query, [email, name, vaccination])
#   db.commit()
#   cur.close()
#   return {}

@app.get("/getProfileData")
def getProfileData(email):
  # query = "select * from profiles where id = %s"
  # cur = db.cursor()
  # cur.execute(query, [id])
  # profileData = cur.fetchone()
  # id, email, name, vaccination = profileData
  # cur.close()
  # return {"id": id, "email": email, "name": name, "vaccination": vaccination}
  return {
    'id': 1,
    'email': 'willdahl1@gmail.com',
    'image': "https://lh3.googleusercontent.com/a-/AOh14Gjh_x3DCBhVidAY5fSfb0KmAZRCUwAmX90igjYxAg=s96-c",
    'name': 'William Dahl',
    'vaccination': 2
  }

# @app.get("/epiwatch-api/v1/article/search/")
# async def searchArticles(start_date, end_date, location, keyterm):

#   isTimeValid = validateTimePeriod(start_date, end_date)
#   if(not isTimeValid):
#     return { 
#       "error_type": "400 Bad Request",
#       "error_description": "Start date must be before the end date"
#     }

#   isLocationValid = validateLocation(location)
#   if(not isLocationValid):
#     return {
#       "error_type": "404 Not Found",
#       "error_description": "Location search term was not found"
#     }

#   query = """select *
# from article
# where (date_of_publication >= %s) and (date_of_publication <= %s)
# limit 1;
# """

#   cur = db.cursor()
#   cur.execute(query, [start_date, end_date])

#   responseArticleData = cur.fetchone()
#   if responseArticleData == None:
#     return {
#       "error_type": "404 Not Found",
#       "error_description": "No articles match search parameters"
#     }
#   else:
#     id, headline, main_text, url, date_of_publication = responseArticleData
#     return {
#       "url": url,
#       "headline": headline,
#       "main_text": main_text,
#       "date_of_publication": date_of_publication,
#       "keyword": [{"name": "mosquito"}],
#       "reports": [{
#         "disease": "deadly_mosquito_larvae",
#         "syndrome": "???",
#         "event_date": "2022-03-10-T16:28:00",
#         "location": {"country": "Spain", "location": "La Palma Island"}
#       }],
#     }

# @app.get("/epiwatch-api/v1/report/search/")
# async def searchReports(start_date, end_date, location, keyterm):

#   isTimeValid = validateTimePeriod(start_date, end_date)
#   if(not isTimeValid):
#     return { 
#       "error_type": "400 Bad request",
#       "error_description": "Start date must be before the end date"
#     }

#   isLocationValid = validateLocation(location)
#   if(not isLocationValid):
#     return {
#       "error_type": "404 Not Found",
#       "error_description": "Location search term was not found"
#     }

#   testReport = {
#     "disease": "deadly_mosquito_larvae",
#     "syndrome": "???",
#     "event_date": "2022-03-10-T16:28:00",
#     "location": {"country": "Spain", "location": "La Palma Island"}
#   }
#   return testReport



# # ================================================================================================

# @app.get("/epiwatch-api/v1/article/getArticleIds/")
# async def getArticleIds():
#   # get article Ids from the database
#   #articleIds = dbGetArticleIds()
#   articleIds = {
#     "articleIds: ": [
#       {"articleId": "testArticleId1"},
#       {"articleId": "testArticleId2"},
#       {"articleId": "testArticleId3"},
#       {"articleId": "testArticleId4"},
#       {"articleId": "testArticleId5"},
#       {"articleId": "testArticleId6"},
#       {"articleId": "testArticleId7"},
#       {"articleId": "testArticleId8"},
#       {"articleId": "testArticleId9"},
#       {"articleId": "testArticleId10"},
#       {"articleId": "testArticleId11"},
#       {"articleId": "testArticleId12"},
#       {"articleId": "testArticleId13"},
#     ]
#   }
#   return articleIds



# @app.get("/epiwatch-api/v1/article/getArticleById/")
# async def getArticleById(articleId):
#   # search through database
#   print(type(articleId))
  

#   # if match is not found - return error response
#   if(int(articleId) == 0):
#     print("testing")
#     return { 
#       "error_type": "503 Internal error",
#       "error_description": "Requested article Id has not been found"
#     }

#   # if match is found return article content
#   testArticle = {
#     "url": "https://promedmail.org/",
#     "headline": "Invasive mosquito",
#     "main_text": "The Canary's Entomological Surveillance System has detected 2 larvae of the _Aedes aegypti_ mosquito on La Palma Island, but this is 'an isolated finding' and they do not have viruses that carry transmissible diseases, the Ministry of Health reported.",
#     "date_of_publication": "2022-03-11T23:57:10",
#     "keyword": [{"name": "mosquito"}],
#     "reports": [{
#       "disease": "deadly_mosquito_larvae",
#       "syndrome": "???",
#       "event_date": "2022-03-10-T16:28:00",
#       "location": {"country": "Spain", "location": "La Palma Island"}
#     }],
#   }

#   return testArticle


# @app.get("/epiwatch-api/v1/report/getReportIds/")
# async def getReportIds():
#   # get article Ids from the database
#   #articleIds = dbGetArticleIds()
#   reportIds = {
#     "reportIds: ": [
#       {"reportId": "reportId1"},
#       {"reportId": "reportId2"},
#       {"reportId": "reportId3"},
#       {"reportId": "reportId4"},
#       {"reportId": "reportId5"},
#       {"reportId": "reportId6"},
#       {"reportId": "reportId7"},
#       {"reportId": "reportId8"},
#       {"reportId": "reportId9"},  
#     ]
#   }
#   return reportIds

# @app.get("/epiwatch-api/v1/article/getReportById/")
# async def getReportById(reportId):
#   # search through database

#   # if match is not found - return error response
#   if(int(reportId) == 0):
#     print("testing")
#     return { 
#       "error_type": "503 Internal error",
#       "error_description": "Requested report Id has not been found"
#     }

#   # if match is found return article content
#   testReport = {
#     "disease": "deadly_mosquito_larvae",
#     "syndrome": "???",
#     "event_date": "2022-03-10-T16:28:00",
#     "location": {"country": "Spain", "location": "La Palma Island"}
#   }

#   return testReport

# ================================================================================================



def custom_openapi():
  # with open("epiwatch-swagger.json", "r") as openapi:
  #     return json.load(openapi)
  if app.openapi_schema:
      return app.openapi_schema
  openapi_schema = get_openapi(
      title="Custom title",
      version="2.5.0",
      description="This is a very custom OpenAPI schema",
      routes=app.routes,
  )
  openapi_schema["info"]["x-logo"] = {
      "url": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png"
  }
  app.openapi_schema = openapi_schema
  return app.openapi_schema

app.openapi = custom_openapi
