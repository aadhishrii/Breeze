from datetime import datetime
import re


def validateTimePeriod(start_date, end_date):
  # start_date must be before end_date
  startDateSeconds = convertDateToSeconds(start_date)
  endDateSeconds = convertDateToSeconds(end_date)
  x = True if (startDateSeconds < endDateSeconds) else False
  return x

def convertDateToSeconds(date):
  # date will be a string in the format: "yyyy-MM-ddTHH:mm:ss"
  # convert that into seconds
  primaryTime = re.match('^(.*?)T', date)
  secondaryTime = re.search("^.*T(.*?)$", date)

  primaryTime = primaryTime[1]
  secondaryTime = secondaryTime[1]

  primaryTimeInSeconds = datetime.strptime(primaryTime, "%Y-%m-%d").timestamp()
  secondaryTimeInSeconds = convertSecondaryToSeconds(secondaryTime)
  totalTimeInSeconds = primaryTimeInSeconds + secondaryTimeInSeconds

  return totalTimeInSeconds


def convertSecondaryToSeconds(secondaryTime):
  h, m, s = secondaryTime.split(':')
  return int(h) * 3600 + int(m) * 60 + int(s)


def validateLocation(location):
  isValid = False if(location == "invalid location") else True
  return isValid

def testFunction():
  return { "message": "testing function"}


keyTerms = {
  "General": [
    "Outbreak",
    "Infection",
    "Fever",
    "Virus",
    "Epidemic",
    "Infectious",
    "Illness",
    "Bacteria",
    "Emerging",
    "Unknown virus",
    "Myster(ious)y disease",
  ],
  "Specific": [
    "Zika",
    "MERS",
    "Salmonella",
    "Legionnaire",
    "Measles",
    "Category A Agents:",
    "Anthrax",
    "Botulism",
    "Plague",
    "Smallpox and other related pox viruses",
    "Tularemia",
    "Junin Fever",
    "Machupo Fever",
    "Guanarito Fever",
    "Chapare Fever",
    "Lassa Fever",
    "Lujo Fever",
  ]
}