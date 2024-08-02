import { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Pieshard extends Component {
    constructor (props) {
		super(props)
		this.state = {
			data: this.props
		}

	}
    
    render() {

        console.log(this.state.data.data.length)

        let dataset = []

        for(let i = 0; i < this.state.data.data.length ; i++){
            dataset.push({
                y: this.state.data.data[i].netVolume.toFixed(2),
                label: this.state.data.data[i].StockSymbol
            })
        }

        console.log(dataset)

        const options = {
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            exportEnabled: false,
            animationEnabled: true,
            title: {
                text: "Overall stock ratio"
            },
            data: [{
                type: "pie",
                startAngle: 25,
                labelAutoFit: true,
                toolTipContent: "{label}: <strong>{y}%</strong>",
                labelLine: {
                    enabled: true,
                  },
                  indexLabelPlacement: "outside",
                  indexLabelMaxWidth: 100,
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 14,
                indexLabel: "{label} {y}%",
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

export default Pieshard;