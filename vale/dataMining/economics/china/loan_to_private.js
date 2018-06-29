var crawlerjs = require('crawler-js');
var fs = require('fs');
var json2csv = require('json2csv');

fields = ['valor_INTEREST_RATE_LAST','valor_INTEREST_RATE_Q4_16','valor_INTEREST_RATE_Q1_17','valor_INTEREST_RATE_Q2_17','valor_INTEREST_RATE_Q3_17','valor_INTEREST_RATE_2020','valor_CASH_RESERVE_RATIO_LAST','valor_CASH_RESERVE_RATIO_Q4_16','valor_CASH_RESERVE_RATIO_Q1_17','valor_CASH_RESERVE_RATIO_Q2_17','valor_CASH_RESERVE_RATIO_Q3_17','valor_CASH_RESERVE_RATIO_2020','valor_INTERBANK_RATE_LAST','valor_INTERBANK_RATE_Q4_16','valor_INTERBANK_RATE_Q1_17','valor_INTERBANK_RATE_Q2_17','valor_INTERBANK_RATE_Q3_17','valor_INTERBANK_RATE_2020','valor_MONEY_SUPPLY_M0_LAST','valor_MONEY_SUPPLY_M0_Q4_16','valor_MONEY_SUPPLY_M0_Q1_17','valor_MONEY_SUPPLY_M0_Q2_17','valor_MONEY_SUPPLY_M0_Q3_17','valor_MONEY_SUPPLY_M0_2020','valor_MONEY_SUPPLY_M1_LAST','valor_MONEY_SUPPLY_M1_Q4_16','valor_MONEY_SUPPLY_M1_Q1_17','valor_MONEY_SUPPLY_M1_Q2_17','valor_MONEY_SUPPLY_M1_Q3_17','valor_MONEY_SUPPLY_M1_2020','valor_MONEY_SUPPLY_M2_LAST','valor_MONEY_SUPPLY_M2_Q4_16','valor_MONEY_SUPPLY_M2_Q1_17','valor_MONEY_SUPPLY_M2_Q2_17','valor_MONEY_SUPPLY_M2_Q3_17','valor_MONEY_SUPPLY_M2_2020','valor_FOREIGN_ENCHANGE_RESERVES_LAST','valor_FOREIGN_ENCHANGE_RESERVES_Q4_16','valor_FOREIGN_ENCHANGE_RESERVES_Q1_17','valor_FOREIGN_ENCHANGE_RESERVES_Q2_17','valor_FOREIGN_ENCHANGE_RESERVES_Q3_17','valor_FOREIGN_ENCHANGE_RESERVES_2020','valor_CENTRAL_BANK_BALANCE_SHEET_LAST','valor_CENTRAL_BANK_BALANCE_SHEET_Q4_16','valor_CENTRAL_BANK_BALANCE_SHEET_Q1_17','valor_CENTRAL_BANK_BALANCE_SHEET_Q2_17','valor_CENTRAL_BANK_BALANCE_SHEET_Q3_17','valor_CENTRAL_BANK_BALANCE_SHEET_2020','valor_BANKS_BALANCE_SHEET_LAST','valor_BANKS_BALANCE_SHEET_Q4_16','valor_BANKS_BALANCE_SHEET_Q1_17','valor_BANKS_BALANCE_SHEET_Q2_17','valor_BANKS_BALANCE_SHEET_Q3_17','valor_BANKS_BALANCE_SHEET_2020','valor_LOANS_TO_PRIVATE_SECTOR_LAST','valor_LOANS_TO_PRIVATE_SECTOR_Q4_16','valor_LOANS_TO_PRIVATE_SECTOR_Q1_17','valor_LOANS_TO_PRIVATE_SECTOR_Q2_17','valor_LOANS_TO_PRIVATE_SECTOR_Q3_17','valor_LOANS_TO_PRIVATE_SECTOR_2020','valor_DEPOSIT_INTEREST_RATE_LAST','valor_DEPOSIT_INTEREST_RATE_Q4_16','valor_DEPOSIT_INTEREST_RATE_Q1_17','valor_DEPOSIT_INTEREST_RATE_Q2_17','valor_DEPOSIT_INTEREST_RATE_Q3_17','valor_DEPOSIT_INTEREST_RATE_2020','valor_LOAN_GROWTH_LAST','valor_LOAN_GROWTH_Q4_16','valor_LOAN_GROWTH_Q1_17','valor_LOAN_GROWTH_Q2_17','valor_LOAN_GROWTH_Q3_17','valor_LOAN_GROWTH_2020','valor_LOANS_TO_BANKS_LAST','valor_LOANS_TO_BANKS_Q4_16','valor_LOANS_TO_BANKS_Q1_17','valor_LOANS_TO_BANKS_Q2_17','valor_LOANS_TO_BANKS_Q3_17','valor_LOANS_TO_BANKS_2020'];



crawler = {
	interval: 100,
	getSample: 'http://www.tradingeconomics.com/china/loans-to-private-sector/forecast',
	get: 'http://www.tradingeconomics.com/china/loans-to-private-sector/forecast',
  preview: 3,
	extractors: [
		{
		selector: '#aspnetForm div.container div.row div.col-lg-8.col-md-9 div:nth-child(11) div table',
		callback: function (err,html,url,response) {
			data = {};
			data.valor_INTEREST_RATE_LAST = html.children('tr').eq(0).children('td').eq(1).text();
			data.valor_INTEREST_RATE_Q4_16 = html.children('tr').eq(0).children('td').eq(2).text();
			data.valor_INTEREST_RATE_Q1_17 = html.children('tr').eq(0).children('td').eq(3).text();
			data.valor_INTEREST_RATE_Q2_17 = html.children('tr').eq(0).children('td').eq(4).text();
			data.valor_INTEREST_RATE_Q3_17 = html.children('tr').eq(0).children('td').eq(5).text();
			data.valor_INTEREST_RATE_2020 = html.children('tr').eq(0).children('td').eq(6).text();
	
			data.valor_CASH_RESERVE_RATIO_LAST = html.children('tr').eq(1).children('td').eq(1).text();
			data.valor_CASH_RESERVE_RATIO_Q4_16 = html.children('tr').eq(1).children('td').eq(2).text();
			data.valor_CASH_RESERVE_RATIO_Q1_17 = html.children('tr').eq(1).children('td').eq(3).text();
			data.valor_CASH_RESERVE_RATIO_Q2_17 = html.children('tr').eq(1).children('td').eq(4).text();
			data.valor_CASH_RESERVE_RATIO_Q3_17 = html.children('tr').eq(1).children('td').eq(5).text();
			data.valor_CASH_RESERVE_RATIO_2020 = html.children('tr').eq(1).children('td').eq(6).text();
	
			data.valor_INTERBANK_RATE_LAST = html.children('tr').eq(2).children('td').eq(1).text();
			data.valor_INTERBANK_RATE_Q4_16 = html.children('tr').eq(2).children('td').eq(2).text();
			data.valor_INTERBANK_RATE_Q1_17 = html.children('tr').eq(2).children('td').eq(3).text();
			data.valor_INTERBANK_RATE_Q2_17 = html.children('tr').eq(2).children('td').eq(4).text();
			data.valor_INTERBANK_RATE_Q3_17 = html.children('tr').eq(2).children('td').eq(5).text();
			data.valor_INTERBANK_RATE_2020 = html.children('tr').eq(2).children('td').eq(6).text();
			
			data.valor_MONEY_SUPPLY_M0_LAST = html.children('tr').eq(3).children('td').eq(1).text();
			data.valor_MONEY_SUPPLY_M0_Q4_16 = html.children('tr').eq(3).children('td').eq(2).text();
			data.valor_MONEY_SUPPLY_M0_Q1_17 = html.children('tr').eq(3).children('td').eq(3).text();
			data.valor_MONEY_SUPPLY_M0_Q2_17 = html.children('tr').eq(3).children('td').eq(4).text();
			data.valor_MONEY_SUPPLY_M0_Q3_17 = html.children('tr').eq(3).children('td').eq(5).text();
			data.valor_MONEY_SUPPLY_M0_2020 = html.children('tr').eq(3).children('td').eq(6).text();

			data.valor_MONEY_SUPPLY_M1_LAST = html.children('tr').eq(4).children('td').eq(1).text();
			data.valor_MONEY_SUPPLY_M1_Q4_16 = html.children('tr').eq(4).children('td').eq(2).text();
			data.valor_MONEY_SUPPLY_M1_Q1_17 = html.children('tr').eq(4).children('td').eq(3).text();
			data.valor_MONEY_SUPPLY_M1_Q2_17 = html.children('tr').eq(4).children('td').eq(4).text();
			data.valor_MONEY_SUPPLY_M1_Q3_17 = html.children('tr').eq(4).children('td').eq(5).text();
			data.valor_MONEY_SUPPLY_M1_2020 = html.children('tr').eq(4).children('td').eq(6).text();

			data.valor_MONEY_SUPPLY_M2_LAST = html.children('tr').eq(5).children('td').eq(1).text();
			data.valor_MONEY_SUPPLY_M2_Q4_16 = html.children('tr').eq(5).children('td').eq(2).text();
			data.valor_MONEY_SUPPLY_M2_Q1_17 = html.children('tr').eq(5).children('td').eq(3).text();
			data.valor_MONEY_SUPPLY_M2_Q2_17 = html.children('tr').eq(5).children('td').eq(4).text();
			data.valor_MONEY_SUPPLY_M2_Q3_17 = html.children('tr').eq(5).children('td').eq(5).text();
			data.valor_MONEY_SUPPLY_M2_2020 = html.children('tr').eq(5).children('td').eq(6).text();

			data.valor_FOREIGN_ENCHANGE_RESERVES_LAST = html.children('tr').eq(6).children('td').eq(1).text();
			data.valor_FOREIGN_ENCHANGE_RESERVES_Q4_16 = html.children('tr').eq(6).children('td').eq(2).text();
			data.valor_FOREIGN_ENCHANGE_RESERVES_Q1_17 = html.children('tr').eq(6).children('td').eq(3).text();
			data.valor_FOREIGN_ENCHANGE_RESERVES_Q2_17 = html.children('tr').eq(6).children('td').eq(4).text();
			data.valor_FOREIGN_ENCHANGE_RESERVES_Q3_17 = html.children('tr').eq(6).children('td').eq(5).text();
			data.valor_FOREIGN_ENCHANGE_RESERVES_2020 = html.children('tr').eq(6).children('td').eq(6).text();

			data.valor_CENTRAL_BANK_BALANCE_SHEET_LAST = html.children('tr').eq(7).children('td').eq(1).text();
			data.valor_CENTRAL_BANK_BALANCE_SHEET_Q4_16 = html.children('tr').eq(7).children('td').eq(2).text();
			data.valor_CENTRAL_BANK_BALANCE_SHEET_Q1_17 = html.children('tr').eq(7).children('td').eq(3).text();
			data.valor_CENTRAL_BANK_BALANCE_SHEET_Q2_17 = html.children('tr').eq(7).children('td').eq(4).text();
			data.valor_CENTRAL_BANK_BALANCE_SHEET_Q3_17 = html.children('tr').eq(7).children('td').eq(5).text();
			data.valor_CENTRAL_BANK_BALANCE_SHEET_2020 = html.children('tr').eq(7).children('td').eq(6).text();

			data.valor_BANKS_BALANCE_SHEET_LAST = html.children('tr').eq(8).children('td').eq(1).text();
			data.valor_BANKS_BALANCE_SHEET_Q4_16 = html.children('tr').eq(8).children('td').eq(2).text();
			data.valor_BANKS_BALANCE_SHEET_Q1_17 = html.children('tr').eq(8).children('td').eq(3).text();
			data.valor_BANKS_BALANCE_SHEET_Q2_17 = html.children('tr').eq(8).children('td').eq(4).text();
			data.valor_BANKS_BALANCE_SHEET_Q3_17 = html.children('tr').eq(8).children('td').eq(5).text();
			data.valor_BANKS_BALANCE_SHEET_2020 = html.children('tr').eq(8).children('td').eq(6).text();

			data.valor_LOANS_TO_PRIVATE_SECTOR_LAST = html.children('tr').eq(9).children('td').eq(1).text();
			data.valor_LOANS_TO_PRIVATE_SECTOR_Q4_16 = html.children('tr').eq(9).children('td').eq(2).text();
			data.valor_LOANS_TO_PRIVATE_SECTOR_Q1_17 = html.children('tr').eq(9).children('td').eq(3).text();
			data.valor_LOANS_TO_PRIVATE_SECTOR_Q2_17 = html.children('tr').eq(9).children('td').eq(4).text();
			data.valor_LOANS_TO_PRIVATE_SECTOR_Q3_17 = html.children('tr').eq(9).children('td').eq(5).text();
			data.valor_LOANS_TO_PRIVATE_SECTOR_2020 = html.children('tr').eq(9).children('td').eq(6).text();

			data.valor_DEPOSIT_INTEREST_RATE_LAST = html.children('tr').eq(10).children('td').eq(1).text();
			data.valor_DEPOSIT_INTEREST_RATE_Q4_16 = html.children('tr').eq(10).children('td').eq(2).text();
			data.valor_DEPOSIT_INTEREST_RATE_Q1_17 = html.children('tr').eq(10).children('td').eq(3).text();
			data.valor_DEPOSIT_INTEREST_RATE_Q2_17 = html.children('tr').eq(10).children('td').eq(4).text();
			data.valor_DEPOSIT_INTEREST_RATE_Q3_17 = html.children('tr').eq(10).children('td').eq(5).text();
			data.valor_DEPOSIT_INTEREST_RATE_2020 = html.children('tr').eq(10).children('td').eq(6).text();

			data.valor_LOAN_GROWTH_LAST = html.children('tr').eq(11).children('td').eq(1).text();
			data.valor_LOAN_GROWTH_Q4_16 = html.children('tr').eq(11).children('td').eq(2).text();
			data.valor_LOAN_GROWTH_Q1_17 = html.children('tr').eq(11).children('td').eq(3).text();
			data.valor_LOAN_GROWTH_Q2_17 = html.children('tr').eq(11).children('td').eq(4).text();
			data.valor_LOAN_GROWTH_Q3_17 = html.children('tr').eq(11).children('td').eq(5).text();
			data.valor_LOAN_GROWTH_2020 = html.children('tr').eq(11).children('td').eq(6).text();

			data.valor_LOANS_TO_BANKS_LAST = html.children('tr').eq(12).children('td').eq(1).text();
			data.valor_LOANS_TO_BANKS_Q4_16 = html.children('tr').eq(12).children('td').eq(2).text();
			data.valor_LOANS_TO_BANKS_Q1_17 = html.children('tr').eq(12).children('td').eq(3).text();
			data.valor_LOANS_TO_BANKS_Q2_17 = html.children('tr').eq(12).children('td').eq(4).text();
			data.valor_LOANS_TO_BANKS_Q3_17 = html.children('tr').eq(12).children('td').eq(5).text();
			data.valor_LOANS_TO_BANKS_2020 = html.children('tr').eq(12).children('td').eq(6).text();




			data.url = url;
			console.log(data);
			var csv = json2csv({ data: data, fields: fields });

			fs.writeFile('../../../csv/all/economics-china-loan_to_private.csv', csv, function(err) {
			if (err) throw err;
				console.log('file saved');

			});

			}
		}
	]

}

crawlerjs(crawler);

