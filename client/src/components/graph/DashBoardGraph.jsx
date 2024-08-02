import { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class DashBoardGraph extends Component {
    constructor (props) {
		super(props)
		this.state = {
			data: this.props
		}

	}  


    
    render() {

        const componentData = this.state.data.data.resultByDate

        let dataset = []

        for(let i = 0; i < (this.state.data.data.resultByDate).length; i++){
            dataset.push({
                x: new Date(componentData[i].orderDate.substring(0,10)),
                y: componentData[i].netValue,
                markerColor: "#6B8E23" 
                
            })
        }

        console.log(new Date(componentData[0].orderDate))

        const options = {
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            animationEnabled: true,
            title:{
                text: "แผนภูมิแสดงมูลค่าการซื้อ-ขายรายวัน (USD)"   
            },
            axisX: {
                interval: 1,
                labelFontColor: "darkgray",
				lineThickness: 1,
				gridThickness: 0.3,
                valueFormatString: "DD MMM Y"
            },
            axisY:{
                title: "มูลค่าการซื้อ-ขายรวม (USD)",
                labelFontColor: "darkgray",
				lineThickness: 1,
				gridThickness: 0.3,
                includeZero: true,
                valueFormatString: "$#0"
            },
            data: [{        
                yValueFormatString: "$#,###",
				xValueFormatString: "DD MMM Y",
				type: "spline",
				lineColor: "darkorange",
                dataPoints: dataset
            }]
        }
        
        return (
            <div>
                <CanvasJSChart options = {options} />
            </div>
        );
    }

}

export default DashBoardGraph;