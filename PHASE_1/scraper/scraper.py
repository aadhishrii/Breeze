# Written by William Dahl z5317148 for SENG3011 UNSW

import requests
import re
import sys
from datetime import datetime
import json

API_URL = "https://promedmail.org/wp-admin/admin-ajax.php"
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36"
REQUEST_HEADERS = {
    "Referer": "https://promedmail.org/promed-posts/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36"
}

def scraper(startDate, endDate, keyword):
    print("Searching for articles between:", startDate, "-", endDate, end='')
    if len(keyword) > 0:
        print(" with keyword:", keyword)
    else:
        print(" without a keyword") 
    
    articleIds = getArticleIds(startDate, endDate, keyword, 0, 0)
    print(len(articleIds),"articles found, fetching articles...")

    for id in articleIds:
        articleData = None
        # handling data collection errors
        while articleData == None:
            try:
                articleData = getArticleData(id)
            except Exception as e:
                print(str(e.args[0]))
                print(str(e.args[1]))
                print('Trying again')
        
        yield articleData


# Using the scraper from CLI to generate json files locally for debugging
def main():
    # Providing help tips for execution
    if len(sys.argv) < 2:
        print("\nYou need to enter a start date in the form MM/DD/YYYY e.g .\scraper.py 02/17/2022")
        print("(optional) You can also provide an end date and keyword e.g .\scraper.py 02/17/2022 03/17/2022 measles\n")
        exit()

    startDate = sys.argv[1]

    if len(sys.argv) < 3:
        # default endDate to current date
        endDate = datetime.today().strftime('%m/%d/%Y')
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
        # Writing to a file (dev)
        id = articleData['postinfo']['alert_id']
        filename = f'articles/Article-{id}.json'
        with open(filename, 'w') as file:
            json.dump(articleData, file, indent=4)

def getArticleIds(startDate, endDate, keyword, pageNum, pageMax):
    # Body of request, puts together the query
    body = {
        'action': 'get_promed_search_content', 
        "query[0][name]": 'pagenum', 'query[0][value]':pageNum,
        "query[1][name]": 'kwby1', 'query[1][value]':'summary',
        "query[2][name]": 'search', 'query[2][value]':keyword,
        "query[3][name]": 'date1', 'query[3][value]':startDate,
        "query[4][name]": 'date2', 'query[4][value]':endDate,
        "query[5][name]": 'feed_id', 'query[5][value]':'1',
        "query[6][name]": 'submit', 'query[6][value]':'next',
    }

    # Make request
    response = requests.post(API_URL, body, headers=REQUEST_HEADERS)
    data = response.json()

    # Calculate number of pages
    # It only does this on the first page for efficiency
    if int(pageNum) == 0:
        # hiddenform is the setion that holds the page number
        if data['hiddenform'] == None:
            pageMax = 0
        else:
            pageMaxStr = re.search("Page 1 of [0-9]{1,}", data['hiddenform'])
            pageMax = pageMaxStr.group().strip("Page 1 of ")

    # Parse article ids from scraped results
    ids = re.findall("id[0-9]{1,}", data['results'])
    for x in range(len(ids)):
        ids[x] = ids[x].strip("id")

    if int(pageNum) == int(pageMax):
        return ids
    else:
        pageNum += 1 # increment pageNum
        return ids + getArticleIds(startDate, endDate, keyword, pageNum, pageMax)

# Gets json article data for the id given
def getArticleData(articleId):
    print("Fetching article data Id-" + articleId)
    body = {
        'action': 'get_latest_post_data', 
        'alertId': articleId
    }
    # Makes a request to the ProMed API to get page data for the given article
    response = requests.post(API_URL, body, headers=REQUEST_HEADERS)

    if response.status_code != 200:
        raise Exception('Recieved ' + str(response.status_code) + ' error while requesting data:', response.text)

    return response.json()

if __name__ == "__main__":
    main()


### WAYS TO TEST ###
# Ensure ids array is a set
# Ensure length of the responses is equal to ids returned
# Use test data to check that certain ids are showing in the returned array
# Check article data is being returned