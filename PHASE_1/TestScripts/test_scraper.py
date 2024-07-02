import json
from scraper.scraper import getArticleData, scraper, getArticleIds
from scraper.parser import parser
from scraper.main import main

test_data = {
    'measles_test': {
        'startDate': ' 03/10/2022',
        'endDate': '03/17/2022',
        'keyword': 'measles',
        'unparsed_filepath': "scraper_test_data\\Article-8701998.json",
        'parsed_filepath': "scraper_test_data\\Article-8701998-parsed.json",
    }
}

def test_scraper():
    test_data = test_data['measles_test']
    with open(test_data['unparsed_filepath'], 'r') as file:
        test_data_expected_output = json.load(file)

    output = scraper(test_data['startDate'], test_data['endDate'], test_data['keyword'])
    for article in output:
        assert article == test_data_expected_output

def test_scraper_getArticleIds():
    test_data = test_data['measles_test']
    id = getArticleIds(test_data['startDate'], test_data['endDate'], test_data['keyword'], 0, 0)

    assert type(id) == type.integer
    assert id == 1

def test_scraper_getArticleData():
    test_data = test_data['measles_test']
    with open(test_data['unparsed_filepath'], 'r') as file:
        test_data_expected_output = json.load(file)

    try:
        article_data = getArticleData(test_data_expected_output['postinfo']['alert_id'])
    except Exception as e:
        assert str(e.args[0]) == "Recieved 500 error while requesting data"
        assert str(e.args[1]) == '<p>There has been a critical error on this website.</p><p><a href="https://wordpress.org/support/article/faq-troubleshooting/">Learn more about troubleshooting WordPress.</a></p>'

    assert article_data == test_data_expected_output

def test_parser():
    test_data = test_data['measles_test']
    with open(test_data['unparsed_filepath'], 'r') as file:
        test_data_input = json.load(file)

    with open(test_data['parsed_filepath'], 'r') as file:
        test_data_expected_output = json.load(file)

    output = parser(test_data_input)
    assert output == test_data_expected_output

    
