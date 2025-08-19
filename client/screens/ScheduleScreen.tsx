// client/screens/scheduling/ScheduleScreen.tsx
console.log("ScheduleScreen.tsx");
import React, { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// THEME
const colors = {
  bg: "#fff9f8",
  text: "#6b2f2f",
  subtext: "#b47070",
  line: "#f1d8d8",
  accent: "#f6dede",
  accentStrong: "#f2c9c9",
  pill: "#fdeeee",
  white: "#ffffff",
  shadow: "rgba(0,0,0,0.08)",
};

type Ride = {
  id: string;
  flight: string;
  destination: string;
  bags: number;
  flightDate: string; // "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM"
};

// RULES + FORMATTERS
function within3Days(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return diff / (1000 * 60 * 60 * 24) < 3;
}

function prettyTimeFromFlight(dateStr: string, bufferMinutes = 120) {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime()) && dateStr.includes("T")) {
      const leave = new Date(d.getTime() - (bufferMinutes + 15) * 60000);
      return leave.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }
  } catch {}
  return "3:15pm";
}

function prettyDate(dateStr: string) {
  const d = new Date(dateStr.split("T")[0]);
  return d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
}

// ---------- Screen ----------
function ScheduleScreen() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [showForm, setShowForm] = useState(false);

  const scheduledCount = rides.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={Platform.OS === "ios" ? "dark-content" : "default"} />
      <Header title="Schedule" />

      <ScrollView contentContainerStyle={styles.screenPad}>
        <Text style={styles.h1}>scheduled rides</Text>

        <View style={styles.statusPill}>
          <Text style={styles.statusText}>
            {scheduledCount === 0
              ? "you currently have no scheduled rides"
              : `you currently have ${scheduledCount} scheduled ${
                  scheduledCount === 1 ? "ride" : "rides"
                }`}
          </Text>
        </View>

        {rides.map((r) => (
          <RideCard key={r.id} ride={r} />
        ))}

        <TouchableOpacity style={styles.cta} onPress={() => setShowForm(true)} activeOpacity={0.9}>
          <Text style={styles.ctaText}>schedule a new ride...</Text>
          <Text style={styles.ctaArrow}>›</Text>
        </TouchableOpacity>
      </ScrollView>

      <RideFormModal
        visible={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={(ride) => {
          setRides((prev) => [{ ...ride, id: Date.now().toString() }, ...prev]);
          setShowForm(false);
          Alert.alert("Ride scheduled", "We’ve saved your ride details.");
        }}
      />
    </SafeAreaView>
  );
}
export default ScheduleScreen;

function RideCard({ ride }: { ride: Ride }) {
  const leaveTime = useMemo(() => prettyTimeFromFlight(ride.flightDate), [ride.flightDate]);
  return (
    <View style={styles.card}>
      <View style={{ gap: 4 }}>
        <Text style={styles.cardTitle}>{prettyDate(ride.flightDate)}</Text>
        <Text style={styles.cardSubtitle}>Ride will leave around {leaveTime}</Text>
        <Text style={styles.cardTiny}>
          More details on other riders will be provided three days before you fly.
        </Text>
      </View>
    </View>
  );
}

function RideFormModal({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (ride: Omit<Ride, "id">) => void;
}) {
  const [flight, setFlight] = useState("");
  const [destination, setDestination] = useState("");
  const [bags, setBags] = useState("");
  const [flightDate, setFlightDate] = useState("");

  const blocked = flightDate ? within3Days(flightDate) : false;
  const canSubmit =
    !!flight && !!destination && /^[0-9]*$/.test(bags) && !!flightDate && !blocked;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <Text style={styles.modalTitle}>
              please fill out the{"\n"}following information
            </Text>
            <Text style={styles.modalNote}>
              you cannot schedule a ride if you are flying in the next 3 days
            </Text>

            <LabeledInput
              label="Flight Number:"
              value={flight}
              onChangeText={setFlight}
              placeholder="e.g., BA 178"
            />
            <LabeledInput
              label="Ride Destination:"
              value={destination}
              onChangeText={setDestination}
              placeholder="e.g., JFK Terminal 4"
            />
            <LabeledInput
              label="Number of Large Baggage’s:"
              value={bags}
              onChangeText={(t: string) => {
                if (/^[0-9]*$/.test(t)) setBags(t);
              }}
              keyboardType="numeric"
              placeholder="e.g., 2"
            />
            <LabeledInput
              label="Flight Date (YYYY-MM-DD or YYYY-MM-DDTHH:MM):"
              value={flightDate}
              onChangeText={setFlightDate}
              placeholder="2025-08-22 or 2025-08-22T17:30"
              autoCapitalize="none"
            />

            {blocked && (
              <Text style={styles.blocked}>
                Your flight is within 3 days — scheduling is disabled.
              </Text>
            )}

            <View style={{ height: 12 }} />

            <TouchableOpacity
              style={[styles.primaryBtn, !canSubmit && { opacity: 0.5 }]}
              disabled={!canSubmit}
              onPress={() => {
                onSubmit({ flight, destination, bags: Number(bags), flightDate });
                setFlight("");
                setDestination("");
                setBags("");
                setFlightDate("");
              }}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryBtnText}>schedule a ride</Text>
            </TouchableOpacity>

            <Pressable onPress={onClose} style={{ alignSelf: "center", marginTop: 12 }}>
              <Text style={styles.cancel}>cancel</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function LabeledInput(props: any) {
  const { label, ...rest } = props;
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor={colors.subtext} {...rest} />
    </View>
  );
}

function Header({ title }: { title: string }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerBadge}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  screenPad: { padding: 16, paddingTop: 20, gap: 14 },
  header: { paddingTop: 8, paddingHorizontal: 12 },
  headerBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.pill,
    color: colors.text,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: colors.line,
  },
  h1: { fontSize: 24, color: colors.text, textTransform: "lowercase", fontWeight: "700" },
  statusPill: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statusText: { color: colors.subtext },
  cta: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  ctaText: { color: colors.subtext, fontSize: 14 },
  ctaArrow: { color: colors.subtext, fontSize: 20, lineHeight: 20 },
  card: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 4,
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: { fontWeight: "700", color: colors.text },
  cardSubtitle: { color: colors.subtext, marginBottom: 2 },
  cardTiny: { color: colors.subtext, fontSize: 12 },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", padding: 16 },
  modalCard: { backgroundColor: colors.bg, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: colors.line },
  modalTitle: { color: colors.text, fontSize: 24, fontWeight: "800", lineHeight: 28, textTransform: "lowercase" },
  modalNote: { color: colors.subtext, marginTop: 6, marginBottom: 16 },
  inputLabel: { color: colors.subtext, marginBottom: 6 },
  input: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 12,
    paddingHorizontal: 12,
    color: colors.text,
  },
  blocked: {
    color: "#aa3a3a",
    backgroundColor: "#fde2e2",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f7c0c0",
  },
  primaryBtn: {
    backgroundColor: colors.accentStrong,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.line,
  },
  primaryBtnText: { color: colors.text, fontWeight: "700", textTransform: "lowercase" },
  cancel: { color: colors.subtext, textDecorationLine: "underline" },
});

