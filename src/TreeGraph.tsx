import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

type NodeType = {
  id: string;
  group: string;
  children?: NodeType[];
  collapsed?: boolean;
};

const initialData: NodeType = {
  id: 'group_accountaholics',
  group: 'group',
  children: [
    {
      id: 'component_accounts',
      group: 'component',
      children: [
        {
          id: 'component-id-aggregation',
          group: 'component',
          children: [
            { id: 'component-id-aggregation', group: 'component' },
            { id: 'component-id-verification', group: 'component' },
            { id: 'component-mds', group: 'component' },
            { id: 'component-mgs-gateway', group: 'component' },
            { id: 'component-navigator-cart', group: 'component' },
            { id: 'component-navigator-link', group: 'component' },
            { id: 'component-navigator-native', group: 'component' },
            { id: 'component-navigator-oauth', group: 'component' },
          ],
        },
        { id: 'component-id-verification', group: 'component' },
        { id: 'component-mds', group: 'component' },
        { id: 'component-mgs-gateway', group: 'component' },
        { id: 'component-navigator-cart', group: 'component' },
        { id: 'component-navigator-link', group: 'component' },
        { id: 'component-navigator-native', group: 'component' },
        { id: 'component-navigator-oauth', group: 'component' },
      ],
    },
  ],
};

const TreeGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState<NodeType>(initialData);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 600;
    const duration = 500;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 2]) // Zoom limits
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    (svg as d3.Selection<SVGSVGElement, unknown, null, undefined>).call(zoom);

    const g = svg.append('g').attr('transform', 'translate(50,50)');

    const root = d3.hierarchy(data, (d) => (!d.collapsed ? d.children : null));

    const treeLayout = d3.tree<NodeType>().size([height - 100, width - 100]);
    treeLayout(root);

    const link = g
      .selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#888')
      .attr('stroke-width', 2)
      .attr('d', (d) => {
        const { source, target } = d;
        return `M${source.y},${source.x} C${(source.y + target.y) / 2},${
          source.x
        } ${(source.y + target.y) / 2},${target.x} ${target.y},${target.x}`;
      })
      .style('opacity', 0)
      .transition()
      .duration(duration)
      .style('opacity', 1);

    const nodes = g
      .selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.y},${d.x})`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        d.data.collapsed = !d.data.collapsed;
        setData({ ...data });
      });

    nodes
      .append('circle')
      .attr('r', 10)
      .attr('fill', (d) => (d.data.group === 'group' ? '#64b5f6' : '#f06292'))
      .transition()
      .duration(duration)
      .attr('r', 12);

    nodes
      .append('text')
      .attr('dy', -15)
      .attr('dx', 10)
      .attr('fill', '#fff')
      .style('font-size', '12px')
      .text((d) => d.data.id.replace('component-', '').replace('group_', ''));
  }, [data]);

  return <svg ref={svgRef} width='100%' height='100%' />;
};

export default TreeGraph;
