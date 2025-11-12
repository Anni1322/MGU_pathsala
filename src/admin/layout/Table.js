import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const Table = ({ columns, data, onRowPress }) => {
  return (
    <ScrollView horizontal>
      <View style={styles.table}>
        {/* Header */}
        <View style={styles.headerRow}>
          {columns.map((col) => (
            <Text key={col.key} style={[styles.cell, { width: col.width || 100, fontWeight: 'bold' }]}>
              {col.title}
            </Text>
          ))}
        </View>

        {/* Rows */}
        {data.map((row, rowIndex) => (
          <TouchableOpacity
            key={row.id || rowIndex}
            style={styles.row}
            onPress={() => onRowPress && onRowPress(row)}
          >
            {columns.map((col) => (
              <Text key={col.key} style={[styles.cell, { width: col.width || 100 }]}>
                {row[col.key]}
              </Text>
            ))}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  table: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cell: {
    textAlign: 'center',
    color: '#333',
    fontSize: 14,
  },
});

export default Table;
