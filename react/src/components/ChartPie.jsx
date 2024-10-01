import { Label } from "@headlessui/react";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";


const ChartPie= ({data})=>{


    let dataArr = [];
    
    data.val.forEach(element => {
        

        data.labels.forEach(e => {
            if ( element.includes(e)){
                let result = element.replace(e ,"");
                result = result.trim();
                result = Number(result);
                dataArr.push({
                    label: e,
                    value:result,
                })
            }
            
        });
        
    });
    console.log(dataArr);

    return (
        <div className="dataCard">
        <Doughnut 
            data={{
                labels: dataArr.map((data)=>data.label),
                datasets:[
                    {
                        label:'Count',
                        data:dataArr.map((data)=>data.value),
                    },
                    
                ],
            }}
        />
        </div>
    )
}

export default ChartPie;