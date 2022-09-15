import { headCountChartQuery } from '../../database/querys'

class ChartModel {
  // ...
  static async getChartData (email: string, start: Date, end: Date) {
    const chartData = await headCountChartQuery(email, start, end)
    return chartData
  }
}

export default ChartModel
