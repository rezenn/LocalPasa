import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Shadow } from "../../constants/theme";
import { useArtisan } from "../../hooks/useApi";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - Spacing.lg * 2 - Spacing.md) / 2;

const DEMO_PRODUCTS = [
  {
    id: "1",
    name: "Green Tara Thanka",
    price: "NPR 15,000",
    description: "Traditional painting",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Tara_Green_Jokhang.jpg/800px-Tara_Green_Jokhang.jpg",
    inStock: true,
  },
  {
    id: "2",
    name: "Saraswati Thanka",
    price: "NPR 12,000",
    description: "Goddess of wisdom",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Saraswati_painting.jpg/800px-Saraswati_painting.jpg",
    inStock: true,
  },
  {
    id: "3",
    name: "Buddha Avalokite",
    price: "NPR 18,000",
    description: "Compassion deity",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Avalokitesvara_Padmapani.jpg/800px-Avalokitesvara_Padmapani.jpg",
    inStock: false,
  },
  {
    id: "4",
    name: "Mandala Art",
    price: "NPR 8,000",
    description: "Sacred geometry",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Tibetan_mandala.jpg/800px-Tibetan_mandala.jpg",
    inStock: true,
  },
  {
    id: "5",
    name: "Medicine Buddha",
    price: "NPR 22,000",
    description: "Healing deity painting",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Medicine_Buddha.jpg/800px-Medicine_Buddha.jpg",
    inStock: true,
  },
  {
    id: "6",
    name: "Vajrayana Scroll",
    price: "NPR 9,500",
    description: "Sacred Tibetan scroll",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Thangka_Depicting_Vajrabhairava.jpg/800px-Thangka_Depicting_Vajrabhairava.jpg",
    inStock: true,
  },
];

export default function ProductsListScreen() {
  const { artisanId } = useLocalSearchParams<{ artisanId?: string }>();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const { data: artisan } = useArtisan(artisanId ?? "");
  const products = (
    artisan?.products?.length ? artisan.products : DEMO_PRODUCTS
  ).filter(
    (p: any) => !search || p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {artisan ? `${artisan.name}'s Products` : "Products"}
        </Text>
      </View>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={16} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={products}
        keyExtractor={(item: any) => item.id || item.name}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={{ gap: Spacing.md }}
        renderItem={({ item }: any) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.85}>
            <Image
              source={{ uri: item.image || "https://via.placeholder.com/200" }}
              style={styles.cardImage}
            />
            {!item.inStock && (
              <View style={styles.soldOut}>
                <Text style={styles.soldOutText}>Sold Out</Text>
              </View>
            )}
            <View style={styles.cardBody}>
              <Text style={styles.cardName} numberOfLines={2}>
                {item.name}
              </Text>
              {item.description && (
                <Text style={styles.cardDesc} numberOfLines={1}>
                  {item.description}
                </Text>
              )}
              <View style={styles.cardBottom}>
                <Text style={styles.cardPrice}>{item.price}</Text>
                <TouchableOpacity
                  style={[
                    styles.addBtn,
                    !item.inStock && styles.addBtnDisabled,
                  ]}
                  disabled={!item.inStock}
                >
                  <Ionicons name="add" size={16} color={Colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="bag-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: "CrimsonBold",
    color: Colors.white,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Shadow.sm,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text },
  grid: { padding: Spacing.lg, paddingBottom: Spacing.xl },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: "hidden",
    ...Shadow.sm,
    position: "relative",
  },
  cardImage: { width: "100%", height: 150 },
  soldOut: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 150,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  soldOutText: { color: Colors.white, fontWeight: "700", fontSize: 13 },
  cardBody: { padding: Spacing.sm },
  cardName: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 2,
  },
  cardDesc: { fontSize: 11, color: Colors.textMuted, marginBottom: 6 },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardPrice: { fontSize: 13, fontWeight: "700", color: Colors.primary },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnDisabled: { backgroundColor: Colors.textMuted },
  empty: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 16, color: Colors.textMuted },
});
