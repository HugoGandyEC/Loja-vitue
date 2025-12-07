import { MOCK_SALES, PRODUCTS, CATEGORIES } from '../data/mockData';

// Calcula métricas do dashboard baseado nos dados reais
export const calculateDashboardMetrics = () => {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last60Days = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Filtrar vendas dos últimos 30 dias
    const salesLast30Days = MOCK_SALES.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= last30Days && sale.status === 'completed';
    });

    // Filtrar vendas dos 30 dias anteriores (para comparação)
    const salesPrevious30Days = MOCK_SALES.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= last60Days && saleDate < last30Days && sale.status === 'completed';
    });

    // Total de vendas
    const totalSales = salesLast30Days.reduce((sum, sale) => sum + sale.total, 0);
    const previousTotalSales = salesPrevious30Days.reduce((sum, sale) => sum + sale.total, 0);
    const salesGrowth = previousTotalSales > 0
        ? ((totalSales - previousTotalSales) / previousTotalSales) * 100
        : 0;

    // Taxa de conversão (simulada - baseada em vendas/visitantes)
    const conversionRate = 12.5;
    const previousConversionRate = 13.0;
    const conversionGrowth = conversionRate - previousConversionRate;

    // Valor médio do pedido
    const averageOrderValue = salesLast30Days.length > 0
        ? totalSales / salesLast30Days.length
        : 0;
    const previousAverageOrderValue = salesPrevious30Days.length > 0
        ? previousTotalSales / salesPrevious30Days.length
        : 0;
    const avgOrderGrowth = previousAverageOrderValue > 0
        ? ((averageOrderValue - previousAverageOrderValue) / previousAverageOrderValue) * 100
        : 0;

    // Receita por categoria
    const revenueByCategory: { [key: string]: number } = {};

    salesLast30Days.forEach(sale => {
        sale.items.forEach(item => {
            const product = PRODUCTS.find(p => p.id === item.productId);
            if (product) {
                const category = CATEGORIES.find(c => c.id === product.categoryId);
                if (category) {
                    const categoryName = category.name;
                    revenueByCategory[categoryName] = (revenueByCategory[categoryName] || 0) + (item.quantity * item.unitPrice);
                }
            }
        });
    });

    const totalRevenue = Object.values(revenueByCategory).reduce((sum, val) => sum + val, 0);

    const categoryPercentages = Object.entries(revenueByCategory).map(([name, value]) => ({
        name,
        value,
        percentage: totalRevenue > 0 ? (value / totalRevenue) * 100 : 0,
    }));

    // Tráfego do site (simulado - dados de exemplo)
    const dailyTraffic = Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        visitors: Math.floor(35000 + Math.random() * 10000),
    }));

    const totalVisitors = dailyTraffic.reduce((sum, day) => sum + day.visitors, 0);
    const avgVisitorsPerDay = totalVisitors / 30;

    // Novos usuários mensais (simulado)
    const monthlyNewUsers = [
        { month: 'Jul', users: 1200 },
        { month: 'Ago', users: 1100 },
        { month: 'Set', users: 1400 },
        { month: 'Nov', users: 1300 },
        { month: 'Out', users: 1600 },
        { month: 'Dez', users: 1500 },
    ];

    return {
        totalSales,
        salesGrowth,
        conversionRate,
        conversionGrowth,
        averageOrderValue,
        avgOrderGrowth,
        categoryPercentages,
        totalRevenue,
        dailyTraffic,
        totalVisitors: avgVisitorsPerDay * 30,
        monthlyNewUsers,
    };
};

// Formata valor para moeda brasileira
export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

// Formata número com separador de milhares
export const formatNumber = (value: number): string => {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toFixed(0);
};

// Formata percentual
export const formatPercentage = (value: number, decimals: number = 1): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};
