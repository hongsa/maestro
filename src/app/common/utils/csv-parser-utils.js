(function () {
  'use strict';
  function CSVparserUtils($filter) {
    return {
      csvParser: csvParser,
      convertToCSV: convertToCSV,
      convertEsRawDataToCSV: convertEsRawDataToCSV,
      downloadCSV: downloadCSV,
      downloadCSV2: downloadCSV2,
      convertParsedCSVDataToHighchartsSeries: convertParsedCSVDataToHighchartsSeries,
      convertParsedCSVDataToOverviewTable: convertParsedCSVDataToOverviewTable,
      convertParsedCSVDataToItemSpecificSeries: convertParsedCSVDataToItemSpecificSeries
    };
    function csvParser(csvString) {
      return Papa.parse(csvString).data;
    }
    function convertToCSV(dataContainer) {
      return Papa.unparse({
        fields: [
          'timestamp',
          'count'
        ],
        data: dataContainer.data
      });
    }
    function convertToCSV2(dataContainer, fields) {
      return Papa.unparse({
        fields: fields,
        data: dataContainer
      });
    }
    function convertEsRawDataToCSV(fields, rawData, baseData, startDate, endDate) {
      var filledData = [];
      rawData.forEach(function (row) {
        if (startDate && endDate && row.date >= getDateInString(startDate) && row.date <= getDateInString(endDate)) {
          filledData.push({});
          fields.forEach(function (field) {
            if (baseData && field !== 'date') {
              filledData[filledData.length - 1][field] = (baseData[field] || 0) + (filledData[filledData.length - 2][field] || 0) + (row[field] || 0);
            } else {
              filledData[filledData.length - 1][field] = row[field] || 0;
            }
          });
        } else if (!startDate && !endDate) {
          filledData.push({});
          fields.forEach(function (field) {
            if (baseData && field !== 'date') {
              filledData[filledData.length - 1][field] = (baseData[field] || 0) + (filledData[filledData.length - 2][field] || 0) + (row[field] || 0);
            } else {
              filledData[filledData.length - 1][field] = row[field] || 0;
            }
          });
        }
      });
      return Papa.unparse({
        fields: fields,
        data: filledData
      });
    }
    function downloadCSV(csvData, isParsed, filename) {
      var csv;
      var link;
      var data;
      if (!isParsed) {
        //timestamp to dateString
        csvData.data.forEach(function (date) {
          date[0] = $filter('date')(date[0], 'MM/dd/yyyy');
        });
        csv = convertToCSV(csvData);
      } else {
        csv = csvData;
      }
      if (!filename) {
        filename = 'export.csv';
      }
      window.URL = window.URL || window.webkitURL;
      var blob = new Blob([csv], { type: 'text/csv' });
      link = document.createElement('a');
      link.setAttribute('href', window.URL.createObjectURL(blob));
      link.setAttribute('download', filename);
      link.click();
    }
    function downloadCSV2(csvData, isParsed, filename, fields, isNotDate) {
      var csv;
      var link;
      var data;
      if (!isParsed) {
        if (!isNotDate) {
          //timestamp to dateString
          csvData.forEach(function (date) {
            date[0] = $filter('date')(date[0], 'MM/dd/yyyy');
          });
        }
        csv = convertToCSV2(csvData, fields);
      } else {
        csv = csvData;
      }
      if (!filename) {
        filename = 'export.csv';
      }
      window.URL = window.URL || window.webkitURL;
      var blob = new Blob([csv], { type: 'text/csv' });
      link = document.createElement('a');
      link.setAttribute('href', window.URL.createObjectURL(blob));
      link.setAttribute('download', filename);
      link.click();
    }
    function convertParsedCSVDataToHighchartsSeries(dataContainer, parsedCSV, columns) {
      dataContainer.forEach(function (line) {
        line.data.splice(0);
      });
      for (var i = 1; i < parsedCSV.length; i++) {
        if (parsedCSV[i].length > 3) {
          for (var j = 0; j < columns.length; j++) {
            dataContainer[j].data.push([
              new Date(parsedCSV[i][0]).getTime(),
              parseInt(parsedCSV[i][columns[j]], 10)
            ]);
          }
        }
      }
    }
    function convertParsedCSVDataToOverviewTable(dataContainer, parsedCSV, columns) {
      parsedCSV.forEach(function (row) {
        if (row.length > 3 && row[0] !== 'Date') {
          if (!dataContainer[row[2]] && row[2].length !== 0) {
            dataContainer[row[2]] = {};
            dataContainer[row[2]].name = row[2];
            columns.forEach(function (col) {
              dataContainer[row[2]][parsedCSV[0][col]] = parseInt(row[col], 10);
            });
          } else if (dataContainer[row[2]] && row[2].length !== 0) {
            columns.forEach(function (col) {
              dataContainer[row[2]][parsedCSV[0][col]] += parseInt(row[col], 10);
            });
          }
        }
      });
    }
    function convertParsedCSVDataToItemSpecificSeries(dataContainer, parsedCSV, columns, itemName) {
      dataContainer.forEach(function (line) {
        line.data.splice(0);
      });
      for (var i = 1; i < parsedCSV.length; i++) {
        if (parsedCSV[i].length > 2 && parsedCSV[i][2] === itemName) {
          for (var j = 0; j < columns.length; j++) {
            dataContainer[j].data.push([
              new Date(parsedCSV[i][0]).getTime(),
              parseInt(parsedCSV[i][columns[j]], 10)
            ]);
          }
        }
      }
    }
    function getDateInString(date) {
      return (date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()).toString();
    }
  }
  CSVparserUtils.$inject = ['$filter'];
  angular.module('dataDashboard.common.utils.CSVparserUtils', []).factory('CSVparserUtils', CSVparserUtils);
}());