//-----------------------
// This function will validate the file type and encoding with JavaScript
// This function will verify the encoding of the CSV file using jschardet library
function verifyFile()
{
        // Get the file input element by its id
        var fileInput = document.getElementById("file-input");
        // Get the result element by its id
        var result = document.getElementById("result");
        // Get the first (and only) file selected by the user
        var file = fileInput.files[0];
        // Check if file is selected by using a truthy value
        if (file)
        {
                // Create a new FileReader object
                var reader = new FileReader();
                // Define a callback function that will be executed when the read operation is completed
                reader.onload = function(e)
                {
                        // Get the file content from the event object
                        var content = e.target.result;
                        // Detect the encoding using jschardet library
                        var encoding = jschardet.detect(content);
                        // Detect the line ending using a regular expression that matches either \r\n or \n
                        var lineEnding = content.match(/\r\n|\n/)[0];
                        // Split the content by line ending and get an array of rows
                        var rows = content.split(lineEnding);

                        // Assign a string to represent the line ending as either Windows (\r\n) or Unix (\n)
                        var lineEndingString = lineEnding === "\r\n" ? "Windows (\\r\\n)" : "Unix (\\n)";

                        // Get the number of rows by using the length property of the array
                        var rowCount = rows.length;
                        // Detect the delimiter using a function that returns the most common character among , ; : | \t -
                        var delimiter = detectDelimiter(rows[0]);
                        // Split the first row of the content by delimiter and get an array of columns
                        var columns = rows[0].split(delimiter);
                        // Get the number of columns by using the length property of the array
                        var columnCount = columns.length;
                        // Show the result by setting the inner HTML of the result element
                        result.innerHTML = "File name: " + file.name + "<br>" +
                                "File size: " + file.size + " bytes<br>" +
                                "File type: " + file.type + "<br>" +
                                "Encoding: " + encoding.encoding + "<br>" +
                                "Confidence: " + encoding.confidence + "<br>" +
                                //"Line ending: " + lineEnding + "<br>" +
                                "Line ending: " + lineEndingString + "<br>" +
                                "Delimiter: " + delimiter + "<br>" +
                                "Rows: " + rowCount + "<br>" +
                                //"Columns: " + columnCount;
                                "Columns: " + columnCount + "<br>" +
                                // Create a URL object from the file using URL.createObjectURL method and show it as the absolute path
                                "Absolute path: " + URL.createObjectURL(file) + "<br>";

                        // If the number of rows is more than 1000 or the number of columns is more than 50, show an alert message that the file is too large and rendering may take a while
                        if (rowCount > 2000 || columnCount > 50)
                        {
                                result.innerHTML += "<br> <font color='red'>" + "Note: Selected file is too large. Rendering may take a while..." + " </font>" ;
                        }

                };
                // Read the file content as a binary string using the readAsBinaryString method of the FileReader object and pass in the file as its argument
                reader.readAsBinaryString(file);
        }
        else
        {
                // Show error message by setting the inner HTML of the result element
                result.innerHTML = "No file selected. Please select a file.";
        }
}

//-----------------------
// Define a function that takes a string as an argument and returns the most common character among , ; : | \t -
function detectDelimiter(str)
{
        // Define an array of possible delimiters
        var delimiters = [",", ";", ":", "|", "\t", "-"];
        // Define a variable to store the maximum count of any delimiter
        var maxCount = 0;
        // Define a variable to store the most common delimiter
        var commonDelimiter = null;
        // Loop through each delimiter in the array
        for (var i = 0; i < delimiters.length; i++)
        {
                // Get the current delimiter
                var delimiter = delimiters[i];
                // Split the string by the delimiter and get an array of segments
                var segments = str.split(delimiter);
                // Get the number of segments by using the length property of the array
                var segmentCount = segments.length;
                // If the segment count is greater than the maximum count, update the maximum count and the most common delimiter
                if (segmentCount > maxCount)
                {
                        maxCount = segmentCount;
                        commonDelimiter = delimiter;
                }
        }
        // Return the most common delimiter
        return commonDelimiter;
}

//-----------------------
// This function will analyze the CSV file and show some statistics
function analyzeFile()
{
        // Get the file input element by its id
        var fileInput = document.getElementById("file-input");
        // Get the first (and only) file selected by the user
        var file = fileInput.files[0];
        // Get the result element by its id
        var result = document.getElementById("result");
        // Clear previous result by setting its inner HTML to an empty string
        result.innerHTML = "";
        // Check if file is selected by using a truthy value
        if (file)
        {
                // Create a new FileReader object to read the file content
                var reader = new FileReader();
                // Read the file content as text
                reader.readAsText(file);
                // Define a callback function that will be executed when the read operation is completed
                reader.onload = function(e)
                {
                        // Get the file content from the event object
                        var content = e.target.result;
                        // Split the content by line breaks using the \n character
                        var lines = content.split("\n");
                        // Get the number of rows by getting the length of the lines array
                        var rows = lines.length;
                        // Initialize a variable to store the number of columns and set it to zero
                        var columns = 0;
                        // Initialize a variable to store the total number of cells and set it to zero
                        var cells = 0;
                        // Initialize an array to store the column names and set it to an empty array
                        var columnNames = [];
                        // Initialize an array to store the column values and set it to an empty array
                        var columnValues = [];
                        // Loop through each line using a for loop and count the number of cells by splitting by commas and adding the length of the resulting array to the cells variable
                        for (var i = 0; i < lines.length; i++)
                        {
                                // Split each line by commas using the \, character
                                var values = lines[i].split(",");
                                // Add the length of the values array to the cells variable
                                cells += values.length;
                                // Check if it is the first line (i.e. i is zero) by using an if statement
                                if (i == 0)
                                {
                                        // Set the number of columns to be equal to the length of the values array
                                        columns = values.length;
                                        // Loop through each value in the values array using another for loop and push each value to the columnNames array
                                        for (var j = 0; j < values.length; j++)
                                        {
                                                columnNames.push(values[j]);
                                        }
                                }
                                else
                                {
                                        // Loop through each value in the values array using another for loop and push each value to the columnValues array
                                        for (var j = 0; j < values.length; j++)
                                        {
                                                columnValues.push(values[j]);
                                        }
                                }
                        }
                        // Show some statistics by setting the inner HTML of the result element using template literals
                        result.innerHTML = `
			<table>
			<tr><td>Row count: </td><td>${rows} rows</td></tr>
			<tr><td>Column count: </td><td>${columns} columns</td></tr>
			<tr><td>Cells to be drawn: </td><td>${cells} cells</td></tr>
			<tr><td>Column names: </td><td>${columnNames.join(", ")}</td></tr>
			<tr><td>Download CSV</td><td><button id="download-button" onclick="downloadFile()">Download</button></td></tr>
			</table>
			<BR><B>Advanced Functions</B>
			<table>   			
			<tr><td>CSV data Converted to Chart</td><td><canvas id="chart"></canvas></td></tr>
			<tr><td>CSV Loaded as table</td><td><table id="table"></table></td></tr>
			</table>          
          `;
                        // Create a table element by getting its id
                        var table = document.getElementById("table");
                        // Create a table header row element and append it to the table element
                        var headerRow = table.insertRow();
                        // Loop through each column name in the columnNames array using a for loop and create a table header cell element and append it to the header row element with its text content set to be equal to the column name
                        for (var i = 0; i < columnNames.length; i++)
                        {
                                var headerCell = document.createElement("th");
                                headerCell.textContent = columnNames[i];
                                headerRow.appendChild(headerCell);
                        }
                        // Loop through each row in the lines array except for the first one using a for loop and create a table data row element and append it to the table element
                        for (var i = 1; i < lines.length; i++)
                        {
                                // Split each line by commas using the \, character
                                var values = lines[i].split(",");
                                // Create a table data row element and append it to the table element
                                var dataRow = table.insertRow();
                                // Loop through each value in the values array using another for loop and create a table data cell element and append it to the data row element with its text content set to be equal to the value
                                for (var j = 0; j < values.length; j++)
                                {
                                        var dataCell = dataRow.insertCell();
                                        dataCell.textContent = values[j];
                                }
                        }
                        // Create a chart element by getting its id
                        var chart = document.getElementById("chart");
                        // Create a chart object using the Chart.js library and pass in the chart element as the first argument and an object as the second argument with some options such as type, data, and options
                        var myChart = new Chart(chart,
                        {
                                type: "bar", // Set the type of the chart to be bar
                                data:
                                {
                                        labels: columnNames, // Set the labels of the chart to be equal to the columnNames array
                                        datasets: [
                                                {
                                                        label: "Column Values", // Set the label of the dataset to be "Column Values"
                                                        data: columnValues, // Set the data of the dataset to be equal to the columnValues array
                                                        backgroundColor: "lightblue", // Set the background color of the bars to be lightblue
                                                        borderColor: "darkblue", // Set the border color of the bars to be darkblue
                                                        borderWidth: 1 // Set the border width of the bars to be 1
                    }]
                                },
                                options:
                                {
                                        scales:
                                        {
                                                y:
                                                {
                                                        beginAtZero: true // Set the y-axis to begin at zero
                                                }
                                        }
                                }
                        });
                };
        }
        else
        {
                // Show error message by setting the inner HTML of the result element
                result.innerHTML = "No file selected. Please select a file.";
        }
}

//-----------------------
// This function will download the CSV file as a text file using FileSaver.js library
function downloadFile()
{
        // Get the file input element by its id
        var fileInput = document.getElementById("file-input");
        // Get the first (and only) file selected by the user
        var file = fileInput.files[0];
        // Check if file is selected by using a truthy value
        if (file)
        {
                // Create a new Blob object with the file content as its first argument and an object with type as its second argument
                var blob = new Blob([file],
                {
                        type: "text/plain"
                });
                // Save the blob as a text file using FileSaver.js library and pass in the blob as its first argument and a file name as its second argument
                saveAs(blob, "csv-analyzer.txt");
        }
        else
        {
                // Show error message by setting the inner HTML of the result element
                result.innerHTML = "No file selected. Please select a file.";
        }
}

//-----------------------
// Define a function that will read the file content using FileReader API
function readFile(file, callback)
{
        // Create a new FileReader object
        var reader = new FileReader();
        // Define a function that will run when the file is loaded
        reader.onload = function(e)
        {
                // Get the file content from the event object
                var content = e.target.result;
                // Store the content in a global variable
                window.content = content;
                // Detect the encoding of the file using jschardet library
                var encoding = jschardet.detect(content);
                // Detect the line ending of the file using detect-newline library
                var lineEnding = detectNewline(content);
                // Detect the delimiter of the file using csv-sniffer library
                var sniffer = new csvSniffer();
                var delimiter = sniffer.sniff(content).delimiter;
                // Count the number of rows and columns in the file by splitting the content by line ending and delimiter
                var rowCount = content.split(lineEnding).length;
                var columnCount = content.split(lineEnding)[0].split(delimiter).length;
                // Convert the line ending to a human-readable string
                switch(lineEnding)
                {
                        case "\r\n":
                                lineEnding = "CRLF";
                                break;
                        case "\n":
                                lineEnding = "LF";
                                break;
                        case "\r":
                                lineEnding = "CR";
                                break;
                        default:
                                lineEnding = "Unknown";
                                break;
                }
                // Display some information about the file on the webpage
                document.getElementById("encoding").innerHTML = encoding.encoding;
                document.getElementById("confidence").innerHTML = encoding.confidence;
                document.getElementById("line-ending").innerHTML = lineEnding;
                document.getElementById("delimiter").innerHTML = delimiter;
                document.getElementById("row-count").innerHTML = rowCount;
                document.getElementById("column-count").innerHTML = columnCount;
                
                // Call the callback function if it exists
                if (callback) {
                        callback();
                }
        };
        // Read the file as text
        reader.readAsText(file);
}


//-----------------------
// Define a function that will create a data grid from the file content using jsGrid library
function createDataGrid()
{
        // Get the file content from the global variable
        var content = window.content; // Make sure this matches the variable name used in readFile function
        // Split the content by line ending and delimiter to get an array of arrays
        var data = content.split(detectNewline(content)).map(function(row) {
                return row.split(sniffer.sniff(content).delimiter);
        });
        // Get the first row as the header fields for the data grid
        var fields = data.shift().map(function(name) {
                return {name: name, type: "text"};
        });
        // Create a jsGrid object and pass it to an element with id "jsGrid"
		$("#data-grid").jsGrid({
            width: "100%",
            height: "400px",
            inserting: true,
            editing: true,
            sorting: true,
            paging: true,
            data: data,
            fields: fields
        });
}

//-----------------------
// Define a function that will handle the file input change event
function handleFileInput()
{
        // Get a File object from an input element with id "file-input"
		var input = document.getElementById("file-input");
		var file = input.files[0];
		// Call the readFile function and pass it the file and a callback function

//-----------------------
// Define a function that will edit a row when the edit button is clicked and takes the button element as an argument
function editRow(button)
{
        // Get the parent element of the button, which is a table cell
        var td = button.parentElement;
        // Get the previous sibling element of the table cell, which is another table cell with the save button
        var prevTd = td.previousElementSibling;
        // Get the child element of the previous table cell, which is the save button
        var saveButton = prevTd.children[0];
        // Enable the save button by setting its disabled property to false
        saveButton.disabled = false;
        // Get the parent element of the table cell, which is a table row
        var tr = td.parentElement;
        // Get all the child elements of the table row, which are table cells
        var tds = tr.children;
        // Loop through each table cell except the last two, which are for buttons
        for (var i = 0; i < tds.length - 2; i++)
        {
                // Get the current table cell
                var cell = tds[i];
                // Set its contenteditable attribute to true to make it editable
                cell.contentEditable = true;
                // Add a border style to the table cell to indicate it is editable
                cell.style.border = "2px solid blue";
        }
}

//-----------------------
// Define a function that will save a row when the save button is clicked and takes the button element as an argument
function saveRow(button)
{
		// Declare a variable to store the new file content and initialize it to an empty string
		var newContent = "";
		// Get the data grid element by its id
		var dataGrid = document.getElementById("data-grid");
		// Get the child elements of the data grid element, which are table rows
		var rows = dataGrid.children;
		// Loop through each table row
														
		for (var j = 0; j < rows.length; j++)
		{
		  // Get the current table row
		  var row = rows[j];
		  alert(row)
		  //var td = button.parentElement;
		}
        // Get the parent element of the button, which is a table cell
        var td = button.parentElement;
        // Get the next sibling element of the table cell, which is another table cell with the edit button
        var nextTd = td.nextElementSibling;
        // Get the child element of the next table cell, which is the edit button
        var editButton = nextTd.children[0];
        // Disable the edit button by setting its disabled property to true
        editButton.disabled = true;
        // Get the parent element of the table cell, which is a table row
        var tr = td.parentElement;
        // Get all the child elements of the table row, which are table cells
        var tds = tr.children;
        // Loop through each table cell except the last two, which are for buttons
        for (var i = 0; i < tds.length - 2; i++)
        {
                // Get the current table cell
                var cell = tds[i];
                // Set its contenteditable attribute to false to make it non-editable
                cell.contentEditable = false;
                // Remove the border style from the table cell
                cell.style.border = "none";
        }
}

//-----------------------
// Toggle Google chart
// Define a function that will toggle the chart visibility when the checkbox is changed and takes no arguments
function toggleChart()
{
        // Get the checkbox element by its id
        var checkbox = document.getElementById("chart-checkbox");
        // Get the chart element by its id
        var chart = document.getElementById("chart");
        // If the checkbox is checked, call the drawChart function to draw the chart and set the chart element's display style to block
        if (checkbox.checked)
        {
                drawChart();
                chart.style.display = "block";
        }
        // Otherwise, set the chart element's display style to none
        else
        {
                chart.style.display = "none";
        }
}