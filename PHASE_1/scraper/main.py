import datetime
import json
import psycopg2
from parser import parser
from scraper import scraper
import sys
import traceback

def connectToDB():
  db = psycopg2.connect(host="localhost", database="epiwatch", user="epiwatch", password="135246")
  db.autocommit = True
  return db

def insertArticleIntoDB(db, article):
  cur = db.cursor()
  query = """insert into article
values (%s, %s, %s, %s, %s);
  """
  try:
    cur.execute(query, [article["id"], article["headline"], article["main_text"], article["url"], article["date_of_publication"]])
    print('inserted article in db')
  except:
    traceback.print_exc()

  cur2 = db.cursor()
  query2 = """insert into report
values (%s, %s, %s, %s, %s, %s)
  """
  report = article["reports"]
  try:
    #print(article["id"],report["diseases"], report["syndromes"], report["event_date"], report["locations"])
    cur2.execute(query2, [article["id"],report["diseases"], report["syndromes"], report["event_date"], report["locations"], article["id"]])
  except:
    traceback.print_exc()

def main():
  # Providing help tips for execution
  if len(sys.argv) < 2:
      print("\nYou need to enter a start date in the form MM/DD/YYYY e.g .\main.py 02/17/2022")
      print("(optional) You can also provide an end date and keyword e.g .\main.py 02/17/2022 03/17/2022 measles\n")
      exit()

  startDate = sys.argv[1]

  if len(sys.argv) < 3:
      # default endDate to current date
      endDate = datetime.datetime.today().strftime('%m/%d/%Y')
      print("Defaulting search with endDate: " + endDate)
  else:
      endDate = sys.argv[2]

  if len(sys.argv) < 4:
      # default to not use a keyword
      keyword = ""
  else:
      keyword = sys.argv[3]

  articles = scraper(startDate, endDate, keyword)
  for articleData in articles:
    article = parser(articleData)

    #db = connectToDB()
    #insertArticleIntoDB(db, article)

    writeToFile(article)

def writeToFile(article):
  id = article["id"]
  filename = f'articles/article-{id}-parsed.json'
  with open(filename, 'w') as file:
    json.dump(article, file, indent=4)

if __name__ == "__main__":
    main()
