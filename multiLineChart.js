d3.text("EPC_2000_2010.csv", function (t) {
        let rows = d3.csvParseRows(t);
        rows[0][0] = "date";
        let data = Array(rows[0].length - 1).fill({});
        for (let row = 0; row < rows.length; row++) {
            for (let column = 1; column < rows[0].length; column++) {
                data[column - 1][rows[row][0]] = rows[row][column];
            }
        }
        console.log(data);
        return data;
    });
