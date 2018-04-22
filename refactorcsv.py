#!/Library/Frameworks/Python.framework/Versions/3.5/bin/python3
from pprint import pprint

brics = ['Brazil', 'Russia', 'India', 'China', 'South Africa', 'United States']

with open('EPC_2000_2010.csv', 'r') as csvfile:
    firstline = csvfile.readline()
    csvdata = csvfile.readlines()

bricsdata = {}
firstline = firstline.replace('\n', '')
dates = firstline.split(',')[1:]
bricsdata['year'] = dates
for line in csvdata:
    line = line.replace('\n', '')
    vals = line.split(',')
    if vals[0] not in brics:
        continue
    bricsdata[vals[0]] = vals[1:]

with open('BRICSdata.csv', 'w') as outfile:
    for 

