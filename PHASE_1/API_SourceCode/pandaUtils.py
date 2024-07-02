import pandas as pd
from fetchData import df
from populationData.populationByPostcode import populationData
#df = pd.read_csv('downloaded.csv')


def getCurrentCases(postcode):
  print("postcode recieved")
  r = df.loc[df.postcode == postcode, :].tail(1)
  df1 = r[['notification_date','confirmed_cases_count']]
  #inplace=True)
  result = df1.to_dict('list')
  return result

# result = getCurrentCases('2077')
# print(result)


def getHistoricalData(postcode):
  print("helloooooo")
  print(df)
  df1 = df.loc[df['postcode'] == postcode]
  df1 = df1[['notification_date','confirmed_cases_count']]
  result = df1.to_dict(orient='records')

  return result


# result = getHistoricalData('2077')
# print("result: ", result)

# totalSum = sum(case['confirmed_cases_count'] for case in result)
# print("total cases: ", totalSum)


# def getCasesToPostcodePopulation(postcode):
#   postcodePopulation = populationData[postcode]
#   postcodeCases = getHistoricalData(postcode)

  








