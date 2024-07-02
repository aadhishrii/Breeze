import json
import re
import locationtagger
from geograpy import extraction
import sys
from scraper import getArticleData

def parser(data):
  # Creating the article object
  article = {}
  article["id"] = getID(data)
  article["url"] = getURL(data)
  article["date_of_publication"] = getDOP(data)
  article["headline"] = getHeadline(data)
  maintext = getMainText(data)
  diseases = getKeywords(maintext)
  article["keywords"] = diseases
  article["main_text"] = maintext

  # Creating the report object [WIP]
  # For now we are just returning one report which contains all the diseases, syndromes and locations mentioned in the article
  report = {}
  if len(diseases) == 0:
    report["diseases"] = 'unknown'
  else:
    report["diseases"] = str(diseases).replace('[','').replace(']','')

  report["syndromes"] = str(getSyndromes(maintext)).replace('[','').replace(']','')
  report["event_date"] = article["date_of_publication"] # for now just using DOP as report date
  report["locations"] = getLocation(maintext)
  article["reports"] = report

  return article

def main():
  # Providing help tips for execution
  if len(sys.argv) < 2:
      print("You need to enter an article id e.g .\parser.py 8702020")
      exit()

  id = sys.argv[1]

  articleData = None
  # handling data collection errors
  while articleData == None:
      try:
          articleData = getArticleData(id)
      except Exception as e:
          print(str(e.args[0]))
          print(str(e.args[1]))
          print('Trying again')

  article = parser(articleData)

  filename = f'articles/Article-{id}-parsed.json'
  with open(filename, 'w') as file:
    json.dump(article, file, indent=4)

def getID (data):
  return data["postinfo"]["alert_id"]

def getLocation (maintext):

  entities = locationtagger.find_locations(text = maintext)

  e = extraction.Extractor(text = maintext)
  e.find_geoEntities()
  #print(set(e.places))
  print(entities.country_cities)

  #countries = str(set(places.countries)).replace('}','').replace('{','')
  return str(entities.cities)

def getDOP (data):
  return data["postinfo"]["issue_date"]

def getHeadline (data):
  headline = data["postinfo"]["summary"]
  # remove intro formatting to headline
  cleaner = re.compile('.*(?=\>)')
  headline = re.sub(cleaner, '', headline)
  headline = re.sub('> ', '', headline)
  return headline

def getMainText (data):
  main_text = data["post"]
  cleaners = [
    re.compile('.*(?=EDR>)'), # remove up to intro indicator
    re.compile('EDR>'), # remove intro indicator
    re.compile('(?<=\.\.\.\.\.).*$'), # remove ending formatting
    re.compile('\.\.\.\.\.'), # remove ending formatting
    re.compile('<.*?>'), # remove html tags
    re.compile('[--]'), # remove article dash formatting 
    re.compile("[*]"), # remove article star formatting 
  ]

  for cleaner in cleaners:
    main_text = re.sub(cleaner, '', main_text)
  return main_text

def getSyndromes (maintext):
  syndromes = []
  path = "./syndrome_list.json"
  with open(path, 'r') as file:
    syndrome_list = json.load(file)
  for syndrome in syndrome_list:
    syndromes.append(str(syndrome['name']).lower())
  article_syndrome = []

  for word in maintext.split(' '):
    if word in syndromes and word not in article_syndrome:
      article_syndrome.append(word)
  return article_syndrome

def getURL(data):
  id = data["postinfo"]["alert_id"]
  return 'https://promedmail.org/promed-post/?id=' + id

def getKeywords(maintext):
  diseases = []
  path = "./disease_list.json"
  with open(path, 'r') as file:
    disease_list = json.load(file)
  for disease in disease_list:
    diseases.append(str(disease['name']).lower())

  keywords = []
  for word in maintext.split(' '):
    if word in diseases and word not in keywords:
      keywords.append(word)
  return keywords

if __name__ == "__main__":
    main()