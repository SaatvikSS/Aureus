import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { ChevronRight, Bell, Trash2, CircleHelp as HelpCircle, User, Moon, Shield, Languages, Wallet } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useTransactionStore } from '@/store/transactionStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import CurrencySelector from '@/components/CurrencySelector';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  onPress: () => void;
  showArrow?: boolean;
  value?: React.ReactNode;
  rightText?: string;
}

function SettingItem({ icon, title, onPress, showArrow = true, value, rightText }: SettingItemProps) {
  return (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        {icon}
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      
      <View style={styles.settingRight}>
        {rightText && <Text style={styles.settingValue}>{rightText}</Text>}
        {value}
        {showArrow && <ChevronRight size={18} color={Colors.gray[400]} />}
      </View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const [showCurrencySelector, setShowCurrencySelector] = React.useState(false);
  const { clearTransactions } = useTransactionStore();
  const { 
    currency, 
    setCurrency,
    darkMode,
    setDarkMode,
    notifications,
    setNotifications,
  } = usePreferencesStore();
  
  const handleProfile = () => {
    Alert.alert(
      'Profile',
      'Would you like to edit your profile?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Edit Profile', onPress: () => Alert.alert('Coming Soon', 'Profile editing will be available in the next update!') }
      ]
    );
  };

  const handleSecurity = () => {
    Alert.alert(
      'Security Settings',
      'Would you like to review your security settings?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Review', onPress: () => Alert.alert('Coming Soon', 'Security settings will be available in the next update!') }
      ]
    );
  };

  const handleLanguage = () => {
    Alert.alert(
      'Language Settings',
      'Would you like to change your language?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Change', onPress: () => Alert.alert('Coming Soon', 'Language settings will be available in the next update!') }
      ]
    );
  };
  
  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all your transaction data? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear Data',
          style: 'destructive',
          onPress: () => {
            clearTransactions();
            Alert.alert('Success', 'All data has been cleared.');
          },
        },
      ]
    );
  };

  const handleHelp = () => {
    Alert.alert(
      'Help & Support',
      'How can we help you?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Contact Support', onPress: () => Linking.openURL('mailto:support@example.com') },
        { text: 'Visit Help Center', onPress: () => Linking.openURL('https://example.com/help') }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.card}>
            <SettingItem
              icon={<User size={20} color={Colors.primary} />}
              title="Profile"
              onPress={handleProfile}
            />
            
            <SettingItem
              icon={<Shield size={20} color={Colors.secondary} />}
              title="Security"
              onPress={handleSecurity}
            />
            
            <SettingItem
              icon={<Languages size={20} color={Colors.accent} />}
              title="Language"
              onPress={handleLanguage}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.card}>
            <SettingItem
              icon={<Wallet size={20} color={Colors.success} />}
              title="Currency"
              onPress={() => setShowCurrencySelector(true)}
              rightText={`${currency.code} (${currency.symbol})`}
            />
            
            <SettingItem
              icon={<Bell size={20} color={Colors.warning} />}
              title="Notifications"
              onPress={() => setNotifications(!notifications)}
              showArrow={false}
              value={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: Colors.gray[300], true: Colors.primary + '50' }}
                  thumbColor={notifications ? Colors.primary : Colors.gray[100]}
                />
              }
            />
            
            <SettingItem
              icon={<Moon size={20} color={Colors.gray[600]} />}
              title="Dark Mode"
              onPress={() => setDarkMode(!darkMode)}
              showArrow={false}
              value={
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: Colors.gray[300], true: Colors.primary + '50' }}
                  thumbColor={darkMode ? Colors.primary : Colors.gray[100]}
                />
              }
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          <View style={styles.card}>
            <SettingItem
              icon={<Trash2 size={20} color={Colors.error} />}
              title="Clear All Data"
              onPress={handleClearData}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help</Text>
          
          <View style={styles.card}>
            <SettingItem
              icon={<HelpCircle size={20} color={Colors.accent} />}
              title="Help & Support"
              onPress={handleHelp}
            />
          </View>
        </View>
        
        <View style={styles.version}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      <CurrencySelector
        visible={showCurrencySelector}
        onClose={() => setShowCurrencySelector(false)}
        selectedCurrency={currency}
        onSelect={setCurrency}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.gray[900],
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray[700],
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray[800],
    marginLeft: 12,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.gray[600],
    marginRight: 8,
  },
  version: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingBottom: 100, // For tab bar
  },
  versionText: {
    fontSize: 14,
    color: Colors.gray[500],
    fontFamily: 'Inter-Regular',
  },
});