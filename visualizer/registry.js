/* Single source of truth for the Visualizer dashboard.
   status: planned | building | ready  (only 'ready' cards link to workspace.html)
   cell: the cell name shown on each card (edit freely) */
window.VIZ_REGISTRY = {
  categories: [
    { id: 'basic', name: 'Charts' },
    { id: 'dist', name: 'Statistical Distribution' },
    { id: 'bio', name: 'Biomedical & Bioinformatics' },
    { id: 'net', name: 'Networks, Hierarchies & Flow' },
    { id: 'dim', name: 'Dimensionality Reduction & Text' }
  ],
  charts: [
    { id: 'scatter', cat: 'basic', cell: 'Neuron', name: 'Scatter', desc: 'Plots each row as a point on X and Y axes to reveal relationships and clusters between two variables.', status: 'planned' },
    { id: 'bubble', cat: 'basic', cell: 'Cardiomyocytes', name: 'Bubble', desc: 'Like a scatter plot, but point size shows a third variable, so you can compare three measurements at once.', status: 'planned' },
    { id: 'line', cat: 'basic', cell: 'Erythrocytes', name: 'Line', desc: 'Connects values in order, ideal for trends over time or across conditions, with multiple series.', status: 'planned' },
    { id: 'multiaxis', cat: 'basic', cell: 'Leukocytes', name: 'Multi-axis', desc: 'Overlays series with different units on separate Y axes, so unlike measurements share one chart.', status: 'planned' },
    { id: 'parcoords', cat: 'basic', cell: 'Osteoblasts', name: 'Parallel Coordinates', desc: 'Draws each row as a line across parallel axes to compare many variables at once; drag on an axis to filter.', status: 'planned' },
    { id: 'pie', cat: 'basic', cell: 'Osteoclasts', name: 'Pie / Donut', desc: 'Shows how a whole splits into parts, as a pie or a donut.', status: 'planned' },
    { id: 'bar', cat: 'basic', cell: 'Osteocytes', name: 'Bar / Column', desc: 'Compares values across categories using grouped, stacked, vertical or horizontal bars.', status: 'planned' },
    { id: 'boxviolin', cat: 'dist', cell: 'Adipocytes', name: 'Box & Violin', desc: 'Summarises the spread of each group with medians and quartiles, or the full density shape in violin mode.', status: 'planned' },
    { id: 'histkde', cat: 'dist', cell: 'Myocytes', name: 'Histogram & KDE', desc: 'Shows how values are distributed by binning them, with a smooth density curve overlaid.', status: 'planned' },
    { id: 'qq', cat: 'dist', cell: 'Astrocytes', name: 'QQ Plot', desc: 'Compares your data against a normal distribution to check whether it is normally distributed.', status: 'planned' },
    { id: 'volcano', cat: 'bio', cell: 'Microglia', name: 'Volcano', desc: 'Plots fold-change against significance to spot up- and down-regulated genes, with adjustable cutoffs.', status: 'planned' },
    { id: 'km', cat: 'bio', cell: 'Oligodendrocytes', name: 'Kaplan-Meier Survival', desc: 'Estimates and compares survival over time between groups, with censor marks and a log-rank test.', status: 'planned' },
    { id: 'manhattan', cat: 'bio', cell: 'Schwann Cells', name: 'Manhattan', desc: 'Displays association p-values along the genome to highlight significant genetic variants.', status: 'planned' },
    { id: 'seqlogo', cat: 'bio', cell: 'Hepatocytes', name: 'Sequence Logo', desc: 'Shows how conserved each position is in aligned DNA, RNA or protein sequences, as stacked letters.', status: 'planned' },
    { id: 'network', cat: 'net', cell: 'Podocytes', name: 'Network Graph', desc: 'Draws entities as nodes and their relationships as links to reveal structure and hubs.', status: 'planned' },
    { id: 'heatdendro', cat: 'net', cell: 'Keratinocytes', name: 'Heatmap + Dendrograms', desc: 'Colours a data matrix and orders rows and columns by similarity, with trees showing the clustering.', status: 'planned' },
    { id: 'sankey', cat: 'net', cell: 'Melanocytes', name: 'Sankey', desc: 'Visualises how quantities flow between stages or categories using proportional-width links.', status: 'planned' },
    { id: 'phylo', cat: 'net', cell: 'Fibroblasts', name: 'Phylogenetic Tree', desc: 'Draws evolutionary relationships between species or sequences from a Newick tree.', status: 'planned' },
    { id: 'dimred', cat: 'dim', cell: 'Chondrocytes', name: 'PCA / t-SNE / UMAP', desc: 'Reduces many-variable data to 2D or 3D so clusters and outliers become visible.', status: 'planned' },
    { id: 'confusion', cat: 'dim', cell: 'Macrophages', name: 'Confusion Matrix', desc: 'Tabulates predicted vs actual classes for a classifier, with accuracy, precision and recall.', status: 'planned' },
    { id: 'wordcloud', cat: 'dim', cell: 'Parietal Cells', name: 'Word Cloud & Frequency Tree', desc: 'Sizes words by how often they appear in text, with a frequency treemap as an alternative.', status: 'planned' },
    { id: 'gantt', cat: 'dim', cell: 'Enterocytes', name: 'Gantt', desc: 'Lays out tasks as bars along a timeline to plan and track schedules.', status: 'planned' }
  ]
};
