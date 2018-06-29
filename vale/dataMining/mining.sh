#!/bin/bash

N=/usr/bin/node

ANO=`date "+%Y"`
MES=`date "+%m"`
DIA=`date "+%d"`
HORA=`date "+%H:%M"`

#rm /root/workspace/bolsa-systems/blueMoney/csv/all/* -rf

echo "\"DATA\",\"RESPOSTA\"" > /root/workspace/bolsa-systems/blueMoney/csv/all/0.csv
echo "\"DATA\",\"1\"" >> /root/workspace/bolsa-systems/blueMoney/csv/all/0.csv

echo "\"clima da CHINA\",\"negociacao entre EUA e BRASIL\",\"abertura do EURO\",\"prisao do lula\",\"justica condena samarco\",\"descoberta de jazida de minerio na china\",\"crise em algum pais/EURO\",\"greve\",\"inflacao-USA\",\"problema/beneficio com alguma empresa concorrente (natureza externa)\",\"novo processo judicial\"" > /root/workspace/bolsa-systems/blueMoney/csv/all/zzz_qualitativos.csv
echo "\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"" >> /root/workspace/bolsa-systems/blueMoney/csv/all/zzz_qualitativos.csv



cd /root/workspace/bolsa-systems/blueMoney/dataMining/acoes/vale5/
$N vale5.js &
cd /root/workspace/bolsa-systems/blueMoney/dataMining/acoes/petr4/
$N petr4.js 
cd /root/workspace/bolsa-systems/blueMoney/dataMining/acoes/usim5/
$N usim5.js &
cd /root/workspace/bolsa-systems/blueMoney/dataMining/acoes/csna3/
$N csna3.js 
cd /root/workspace/bolsa-systems/blueMoney/dataMining/acoes/goll4/
$N goll4.js &
cd /root/workspace/bolsa-systems/blueMoney/dataMining/acoes/ggbr4/
$N ggbr4.js 
cd /root/workspace/bolsa-systems/blueMoney/dataMining/acoes/goau4/
$N goau4.js &
cd /root/workspace/bolsa-systems/blueMoney/dataMining/acoes/jbss3/
$N jbss3.js 
cd /root/workspace/bolsa-systems/blueMoney/dataMining/acoes/cmig4/
$N cmig4.js &




cd /root/workspace/bolsa-systems/blueMoney/dataMining/acoes/anglo-american/
$N anglo-american.js

cd /root/workspace/bolsa-systems/blueMoney/dataMining/acoes/cliff_natural_resources/
$N cliff_natural_resources.js

cd /root/workspace/bolsa-systems/blueMoney/dataMining/acoes/rio_tinto/
$N rio_tinto.js

cd /root/workspace/bolsa-systems/blueMoney/dataMining/bolsas/dji/
$N dji.js 

cd /root/workspace/bolsa-systems/blueMoney/dataMining/bolsas/ibovespa/
$N ibovespa.js

cd /root/workspace/bolsa-systems/blueMoney/dataMining/bolsas/sp500/
$N sp500.js

cd /root/workspace/bolsa-systems/blueMoney/dataMining/commodities/aluminum_futures/
$N aluminum.js

cd /root/workspace/bolsa-systems/blueMoney/dataMining/commodities/coal/
$N coal.js

cd /root/workspace/bolsa-systems/blueMoney/dataMining/commodities/copper/
$N copper_UK.js
$N copper_US.js

cd /root/workspace/bolsa-systems/blueMoney/dataMining/commodities/iron/
$N fe62.js
$N finance.sina.com.cn.js
$N ore-pellets.js 

cd /root/workspace/bolsa-systems/blueMoney/dataMining/commodities/manganese/
$N manganese.js

cd /root/workspace/bolsa-systems/blueMoney/dataMining/commodities/nickel/
$N nickel.js

cd /root/workspace/bolsa-systems/blueMoney/dataMining/economics/brasil/
$N government_bold_yeld.js
$N gdp_growth.js
$N fgv_consumer_confidence.js

cd /root/workspace/bolsa-systems/blueMoney/dataMining/economics/china/
$N business_confidence.js
$N car_index.js
$N gdp_growth.js
$N housing_index.js
$N industrial_production.js
$N loan_to_private.js

cd /root/workspace/bolsa-systems/blueMoney/dataMining/economics/india/
$N gdp_growth.js

cd /root/workspace/bolsa-systems/blueMoney/dataMining/economics/usa/
$N gdp_growth.js


cd /root/workspace/bolsa-systems/blueMoney/csv/all
paste * -d, > ../consolidado.csv

DATA=`date "+%H_%Mh-%d-%h-%Y"`
#removido o comentario....
cp /root/workspace/bolsa-systems/blueMoney/csv/consolidado.csv /root/workspace/bolsa-systems/blueMoney/csv/ultimo.csv
cp /root/workspace/bolsa-systems/blueMoney/csv/consolidado.csv /var/www/webserver/arquivos/coleta-$DATA.csv

cd /root/workspace/bolsa-systems/blueMoney/csv/
head -1 ultimo.csv | sed 's/",/"\n/g' > ultimo.colunas
tail -1 ultimo.csv | sed 's/",/"\n/g' > ultimo.valores
paste ultimo.colunas ultimo.valores > ultimo.txt

head -1 consolidado.csv | sed 's/",/"\n/g' > consolidado.colunas
tail -1 consolidado.csv | sed 's/",/"\n/g' > consolidado.valores
paste consolidado.colunas consolidado.valores > consolidado.txt

rm consolidado.colunas consolidado.valores ultimo.colunas ultimo.valores

colordiff consolidado.txt ultimo.txt
send_bluemoney.js "`cat ultimo.txt | tr '"' '\0' `"

cd - 


echo FINALIZADO TRUTA









