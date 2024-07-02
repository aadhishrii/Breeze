import requests
import pandas as pd

chunksize = 10 ** 8

CASES_CSV_URL = 'https://data.nsw.gov.au/data/dataset/aefcde60-3b0c-4bc0-9af1-6fe652944ec2/resource/5d63b527-e2b8-4c42-ad6f-677f14433520/download/confirmed_cases_table1_location_agg.csv'

df = pd.read_csv('downloaded.csv')

if(df.empty):
  r = requests.get(url = CASES_CSV_URL)
  url_content = r.content

  

  csv_file = open('downloaded.csv', 'wb')
  csv_file.write(url_content)
  csv_file.close()



# vaccination related data








