import React from 'react';
import { DataSourceHttpSettings } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { MyDataSourceOptions } from './types';

export type Props = DataSourcePluginOptionsEditorProps<MyDataSourceOptions>;
export const ConfigEditor = (props: Props) => {
  const { options, onOptionsChange } = props;

  return (
    <>
      <DataSourceHttpSettings defaultUrl="http://localhost:9999" dataSourceConfig={options} onChange={onOptionsChange} showAccessOptions={true} />
    </>
  );
};
