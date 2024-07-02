import requests

apiKey = 'YSdy0GPunH_U7UQdutjmA7rIC_9RQS0jLzEDX7G4vqFvmzfSZJAQVOAs4tWAdFNEvDAPr-fuFat40Ew2726KP6Pw1veonfZ3KJb7PlzcobwonkTApyX9X1_sy3clYnYx'




API_KEY = apiKey
ENDPOINT = 'https://api.yelp.com/v3/businesses/search'
HEADERS = {'Authorization': 'bearer %s' % API_KEY}

# Define parameters
PARAMETERS = {
  'term':'Chatswood Oval',
  'limit':3,
  #'radius':10000,
  'offset':50,
  'location':'Hornsby Sydney New South Wales'
}

response = requests.get(url = ENDPOINT, params = PARAMETERS, headers = HEADERS)
print("response: ", response.json())