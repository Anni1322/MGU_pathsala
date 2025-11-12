import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, Card } from 'react-native-paper';

export default function EGrievances() {
  // Sample dynamic data
  const [eGrievancesData, setEGrievancesData] = useState([
    { category: 'Employee', total: 10, resolved: 5, pending: 5 },
    { category: 'Student', total: 15, resolved: 10, pending: 5 },
    { category: 'Others', total: 8, resolved: 3, pending: 5 },
  ]);

  const [employeeComplainsData, setEmployeeComplainsData] = useState([
    {
      problem: 'Employee Claims/Bills',
      total: 5,
      resolved: 2,
      forwarded: 1,
      pending: 2,
    },
    {
      problem: 'Finance Reports',
      total: 8,
      resolved: 4,
      forwarded: 2,
      pending: 2,
    },
    {
      problem: 'Login ID Password',
      total: 3,
      resolved: 1,
      forwarded: 1,
      pending: 1,
    },
    {
      problem: 'Others(Employee)',
      total: 2,
      resolved: 1,
      forwarded: 0,
      pending: 1,
    },
    {
      problem: 'Problem in Research Project Submission',
      total: 6,
      resolved: 3,
      forwarded: 2,
      pending: 1,
    },
    {
      problem: 'Network Issue',
      total: 4,
      resolved: 2,
      forwarded: 1,
      pending: 1,
    },
    {
      problem: 'Work and Role allotment',
      total: 7,
      resolved: 5,
      forwarded: 1,
      pending: 1,
    },
    {
      problem: 'Establishment',
      total: 3,
      resolved: 1,
      forwarded: 1,
      pending: 1,
    },
    {
      problem: 'New Login Issue',
      total: 4,
      resolved: 2,
      forwarded: 1,
      pending: 1,
    },
    {
      problem: 'Finance Activity',
      total: 10,
      resolved: 6,
      forwarded: 3,
      pending: 1,
    },
  ]);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerText}>eGrievances</Text>
        <Button mode="contained" style={styles.trackButton}>
          Track Complain
        </Button>
      </View>

      {/* eGrievances Data Table */}
      <ScrollView style={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.subHeading}>eGrievances</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Category</Text>
                <Text style={styles.tableHeader}>Total</Text>
                <Text style={styles.tableHeader}>Resolved</Text>
                <Text style={styles.tableHeader}>Pending</Text>
              </View>

              {eGrievancesData.map((data, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{data.category}</Text>
                  <Text style={styles.tableCell}>{data.total}</Text>
                  <Text style={styles.tableCell}>{data.resolved}</Text>
                  <Text style={styles.tableCell}>{data.pending}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Employee Complain Data Table */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.subHeading}>Employee Complain</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Problem Name</Text>
                <Text style={styles.tableHeader}>Total</Text>
                <Text style={styles.tableHeader}>Resolved</Text>
                <Text style={styles.tableHeader}>Forwarded</Text>
                <Text style={styles.tableHeader}>Pending</Text>
              </View>

              {employeeComplainsData.map((complain, index) => (
                <View key={index} style={styles.tableRow}>

                  <Text style={styles.tableCell}>{complain.problem}</Text>

                  {/* <Text style={{borderBlockColor:'#368d55ff'}}> */}
                    <Text style={styles.tableCell}>{complain.total}</Text>
                  {/* </Text> */}
                  <Text style={styles.tableCell}>{complain.resolved}</Text>
                  <Text style={styles.tableCell}>{complain.forwarded}</Text>
                  <Text style={styles.tableCell}>{complain.pending}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f0f4f8',
  },
  header: {
    backgroundColor: '#e24a6dff',
    paddingVertical: 20,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  trackButton: {
    backgroundColor: '#FF6F61',
    borderRadius: 8,
  },
  scrollContainer: {
    marginTop: 10,
    // flex: 1,
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#9ebaff90',
  },
  card: {
    marginBottom: 10,
    borderRadius: 8,
    elevation: 1,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  table: {
    marginTop: 10,
    width: '100%',
    // backgroundColor: '#ffe3e3ff',
    // margin:-10
    padding: -52,
    borderRadius: 10,
    backgroundColor: '#7ca0fe6b',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  tableHeader: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6F61',
    justifyContent: 'center',
    alignItems: 'center',
    // marginLeft: 5,
  },
});
