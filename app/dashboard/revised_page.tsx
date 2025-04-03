﻿'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';

interface CariTemelBilgi {
  CARI_KOD: string;
  CARI_ISIM: string;
  CARI_IL: string;
  CARI_ILCE: string;
  CARI_ADRES: string;
  CARI_TEL?: string;
  CARI_TIP: string;
  DOVIZLIMI: string;
  M_KOD: string;
  POSTAKODU: string;
  VERGI_DAIRESI?: string;
  VERGI_NUMARASI?: string;
  FAX?: string;
}

interface CariData {
  CariTemelBilgi: CariTemelBilgi;
  CariEkBilgi: any;
  SubelerdeOrtak: boolean;
  IsletmelerdeOrtak: boolean;
}

interface ArpsResponse {
  TotalCount: number;
  Limit: number;
  Offset: number;
  IsSuccessful: boolean;
  Data: CariData[];
}

interface CariKayitForm {
  CARI_KOD: string;
  CARI_ISIM: string;
  CARI_ADRES: string;
  CARI_TEL: string;
  CARI_IL: string;
  CARI_ILCE: string;
  CARI_TIP: string;
  DOVIZLIMI: string;
  M_KOD: string;
  POSTAKODU: string;
  VERGI_NUMARASI: string;
  VERGI_DAIRESI: string;
  FAX: string;
}

interface ItemTransaction {
  Stok_Kodu: string;
  Fisno: string;
  Sthar_Gcmik: number;
  Sthar_Gcmik2: number;
  CEVRIM: number;
  Sthar_Gckod: string;
  Sthar_Tarih: string;
  Sthar_Nf: number;
  Sthar_Bf: number;
  Sthar_Iaf: number;
  Sthar_Kdv: number;
  DEPO_KODU: number;
  Sthar_Aciklama: string;
  Sthar_Satisk: number;
  Sthar_Malfisk: number;
  Sthar_Ftirsip: string;
  Sthar_Satisk2: number;
  Liste_Fiat: number;
  Sthar_Htur: string;
  Sthar_Dovtip: number;
  PROMASYON_KODU: number;
  Sthar_Dovfiat: number;
  Sthar_Odegun: number;
  Sthar_Bgtip: string;
  Sthar_Kod1: string;
  Sthar_Carikod: string;
  Redmik: number;
  Redneden: number;
  Sira: number;
  Irsaliye_No: string;
  Irsaliye_Tarih: string;
  Vade_Tarihi: string;
  Proje_Kodu: string;
  OnayTipi: string;
  OnayNum: number;
}

interface ItemTransactionsResponse {
  TotalCount: number;
  Limit: number;
  Offset: number;
  IsSuccessful: boolean;
  Data: ItemTransaction[];
}

interface TransactionFilters {
  page: number;
  pageSize: number;
  sort: string;
  offset?: number;  // Added offset property
}

interface CariFilters {
  page: number;
  pageSize: number;
  sort: string;
  offset?: number;
}

interface MasrafKalem {
  DekontTip?: number;
  TransactSupport?: boolean;
  MuhasebelesmisBelge?: boolean;
  Sube_Kodu?: number;
  IncKeyNo?: string;
  Seri_No?: string;
  Dekont_No?: number;
  Sira_No?: number;
  Fisno?: string;
  Tarih?: string;
  ValorTrh?: string;
  ValorGun?: number;
  C_M?: string;
  Kod?: string;
  Referans?: string;
  CRapKod?: string;
  Plasiyer?: string;
  Aciklama1?: string;
  Aciklama2?: string;
  ACIKLAMA3?: string;
  Aciklama4?: string;
  B_A?: string;
  Tutar?: number;
  Kdv_Oran?: number;
  Kdv_Dahil?: string;
  Genel_KDV?: string;
  Miktar?: number;
  DovTL?: string;
  DOVTIP?: number;
  DOVTUT?: number;
  Proje_Kodu?: string;
  SubeGirilecek?: string;
  KDVDOVIZ?: number;
  Entegrefkey?: string;
  OtoVadeGunuGetir?: boolean;
  KayitYapanKul?: string;
  KayitTarihi?: string;
  DEPO_KODU?: number;
  OnayTipi?: string;
  OnayNum?: number;
  Belge_Tipi?: string;
  Odeme_Turu?: string;
  StopajKodu?: string;
  SsdfKodu?: string;
  StopajOran?: number;
  SsdfOran?: number;
  IndKDV?: string;
  SeriSayisi?: number;
  TEV_KOD?: string;
  TEV_ORAN?: number;
  TEV_TUTAR?: number;
  TEV_HESAP_KODU?: string;
  Olcubr?: number;
  CEVRIM?: number;
}

interface MasrafForm {
  Seri_No: string;
  Dekont_No: number;
  Tarih: string;
  Firma_Adi: string;
  Aciklama: string;
  Kod: string;
  Tutar: number;
  Kdv_Oran: number;
  Proje_Kodu: string;
  Fisno: string;
}

interface MasrafResponse {
  success: boolean;
  error?: string;
}

export default function DashboardPage() {
  const [cariList, setCariList] = useState<CariData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTable, setShowTable] = useState(false);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [showCariForm, setShowCariForm] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState<CariKayitForm>({
    CARI_KOD: '',
    CARI_ISIM: '',
    CARI_ADRES: '',
    CARI_TEL: '',
    CARI_IL: '',
    CARI_ILCE: '',
    CARI_TIP: 'A',
    DOVIZLIMI: 'H',
    M_KOD: '',
    POSTAKODU: '',
    VERGI_NUMARASI: '',
    VERGI_DAIRESI: '',
    FAX: ''
  });
  
  const router = useRouter();

  // Add new state variables for searching by cari code
  const [searchCariKod, setSearchCariKod] = useState('');
  const [searchedCari, setSearchedCari] = useState<CariData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [isSearchResultVisible, setIsSearchResultVisible] = useState(false);

  // Add new state variables for statement header search
  const [statementCode, setStatementCode] = useState('');
  const [statementData, setStatementData] = useState<any>(null);
  const [isStatementLoading, setIsStatementLoading] = useState(false);
  const [showStatementForm, setShowStatementForm] = useState(false);
  const [isStatementFormVisible, setIsStatementFormVisible] = useState(false);

  // Add new state variables for ItemTransactions
  const [itemTransactions, setItemTransactions] = useState<ItemTransaction[]>([]);
  const [showTransactions, setShowTransactions] = useState(false);
  const [isTransactionsVisible, setIsTransactionsVisible] = useState(false);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);
  
  const [transactionFilters, setTransactionFilters] = useState<TransactionFilters>({
    page: 1,
    pageSize: 10,
    sort: 'desc',
    offset: 1
  });

  // Add new state variables for cari pagination
  const [cariFilters, setCariFilters] = useState<CariFilters>({
    page: 1,
    pageSize: 10,
    sort: 'desc',
    offset: 1
  });
  const [isCariLoading, setIsCariLoading] = useState(false);

  // Add new state variables for Masraf
  const [showMasrafKayit, setShowMasrafKayit] = useState(false);
  const [masrafForm, setMasrafForm] = useState<MasrafForm>({
    Seri_No: "",
    Dekont_No: 0,
    Tarih: new Date().toISOString().split('T')[0],
    Firma_Adi: "",
    Aciklama: "",
    Kod: "",
    Tutar: 0,
    Kdv_Oran: 18,
    Proje_Kodu: "",
    Fisno: ""
  });
  const [submittingMasraf, setSubmittingMasraf] = useState(false);
  const [masrafResponse, setMasrafResponse] = useState<any>(null);

  useEffect(() => {
    // Function to check token and redirect if needed
    const checkToken = () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('Token not found, redirecting to login page');
          router.push('/login');
        } else {
          console.log('Token found, user is authenticated');
        }
      } catch (error) {
        console.error('Error checking token:', error);
        // If we can't access localStorage, redirect to login
        router.push('/login');
      }
    };

    // Initial check
    checkToken();

    // Set up an interval to check the token periodically
    // This helps ensure the token is valid during the user's session
    const tokenCheckInterval = setInterval(checkToken, 300000); // Check every 5 minutes

    // Clean up the interval when the component unmounts
    return () => clearInterval(tokenCheckInterval);
  }, [router]);

  const handleTokenRefresh = async () => {
    try {
      const formData = new FormData();
      formData.append('grant_type', 'password');
      formData.append('username', 'Furkan');
      formData.append('password', 'Fd123456');
      formData.append('branchCode', '0');
      formData.append('dbType', '0');
      formData.append('dbName', 'KENANSB');
      formData.append('dbUser', 'TEMELSET');
      formData.append('dbPassword', '');

      const response = await fetch('/api/token', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Token yenilenemedi');
      }

      const data = await response.json();
      
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
      } else {
        throw new Error('Token alÄ±namadÄ±');
      }
    } catch (err) {
      console.error('Token yenileme hatasÄ±:', err);
      setError('Token yenilenirken bir hata oluÅŸtu');
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const cariData = {
        CariTemelBilgi: {
          ...formData,
          // Default values
          Sube_Kodu: 1,
          ISLETME_KODU: 1,
          DETAY_KODU: 0,
          NAKLIYE_KATSAYISI: 0.0,
          RISK_SINIRI: 0.0,
          TEMINATI: 0.0,
          CARISK: 0.0,
          CCRISK: 0.0,
          SARISK: 0.0,
          SCRISK: 0.0,
          CM_BORCT: 0.00,
          CM_ALACT: 0.00,
          ISKONTO_ORANI: 0.0,
          VADE_GUNU: 0,
          LISTE_FIATI: 0,
          DOVIZ_TIPI: 0,
          DOVIZ_TURU: 0,
          HESAPTUTMASEKLI: "Y",
          Update_Kodu: "X",
          LOKALDEPO: 0,
          C_Yedek1: "A",
          C_Yedek2: "E",
          B_Yedek1: 0,
          ODEMETIPI: 0,
          OnayTipi: "A",
          OnayNum: 0,
          MUSTERIBAZIKDV: "H",
          TeslimCariBagliMi: "H",
          ULKE_KODU: "TR"
        }
      };

      const response = await fetch('http://172.16.20.230:7171/api/v2/ARPs', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(cariData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Cari kayÄ±t edilemedi: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.IsSuccessful) {
        setFormData({
          CARI_KOD: '',
          CARI_ISIM: '',
          CARI_ADRES: '',
          CARI_TEL: '',
          CARI_IL: '',
          CARI_ILCE: '',
          CARI_TIP: 'A',
          DOVIZLIMI: 'H',
          M_KOD: '',
          POSTAKODU: '',
          VERGI_NUMARASI: '',
          VERGI_DAIRESI: '',
          FAX: ''
        });
        setShowCariForm(false);
        setIsFormVisible(false);
      } else {
        throw new Error(`Cari kayÄ±t iÅŸlemi baÅŸarÄ±sÄ±z: ${result.Message || 'Bilinmeyen hata'}`);
      }
    } catch (err: any) {
      console.error('Cari kayÄ±t hatasÄ±:', err);
      setError(`Cari kayÄ±t edilirken bir hata oluÅŸtu: ${err.message || 'Bilinmeyen hata'}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchCariList = async (params: any = {}) => {
    try {
      setLoading(true);
      setIsCariLoading(true);
      setError(null);
      console.log('Cari listesi yÃ¼kleniyor...');
      
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return false;
      }
      
      // Build query parameters for pagination
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', String(params.limit));
      if (params.offset) queryParams.append('offset', String(params.offset));
      if (params.first === true) queryParams.append('first', 'true');
      if (params.last === true) queryParams.append('last', 'true');
      
      const apiUrl = `http://172.16.20.230:7171/api/v2/arps${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      console.log('API isteÄŸi URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API hatasÄ±: HTTP ${response.status}`);
      }
      
      let data;
      try {
        const text = await response.text();
        console.log('API yanÄ±t metni alÄ±ndÄ±, ilk 100 karakter:', text.substring(0, 100));
        
        if (!text) {
          throw new Error('BoÅŸ yanÄ±t');
        }
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('API yanÄ±tÄ± iÅŸlenemedi:', parseError);
        throw new Error('API yanÄ±tÄ± iÅŸlenemedi');
      }
      
      console.log('API yanÄ±tÄ± baÅŸarÄ±yla parse edildi');

      if (data && data.IsSuccessful === true && Array.isArray(data.Data)) {
        console.log('Cari verisi baÅŸarÄ±yla alÄ±ndÄ±, kayÄ±t sayÄ±sÄ±:', data.Data.length);
        setCariList(data.Data);
        
        // Show the table
        setShowTable(true);
        setTimeout(() => {
          setIsTableVisible(true);
        }, 50);
        
        return true;
      } else {
        console.error('API yanÄ±tÄ± beklenen formatta deÄŸil:', data);
        if (data?.Message) {
          setError(`API HatasÄ±: ${data.Message}`);
        } else {
          setError('Cari listesi beklenen formatta deÄŸil');
        }
        return false;
      }
    } catch (err: any) {
      console.error('Cari listesi yÃ¼klenirken hata:', err);
      setError(`Cari listesi yÃ¼klenirken bir hata oluÅŸtu: ${err.message || 'Bilinmeyen hata'}`);
      return false;
    } finally {
      setLoading(false);
      setIsCariLoading(false);
    }
  };

  const handleCardClick = (params: any = {}) => {
    if (!params.force && showTable && !params.first && !params.last) {
      setIsTableVisible(false);
      setTimeout(() => {
        setShowTable(false);
      }, 500);
    } else {
      if (params.first || params.last || params.offset) {
        fetchCariList({...params, force: true});
      } else {
        fetchCariList();
      }
    }
  };

  const handleCariFormCard = () => {
    if (showCariForm) {
      setIsFormVisible(false);
      setTimeout(() => {
        setShowCariForm(false);
      }, 500);
    } else {
      setShowCariForm(true);
      setTimeout(() => {
        setIsFormVisible(true);
      }, 50);
    }
  };

  // Add a new function to fetch cari details by code
  const fetchCariByCode = async (cariKod: string) => {
    if (!cariKod.trim()) {
      setError('LÃ¼tfen bir Cari Kodu girin');
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      
      // API isteÄŸi iÃ§in URL
      const encodedQuery = encodeURIComponent(`CARI_KOD='${cariKod}'`);
      const apiUrl = `http://172.16.20.230:7171/api/v2/arps?q=${encodedQuery}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Cari bilgisi alÄ±namadÄ±: HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.IsSuccessful && Array.isArray(data.Data) && data.Data.length > 0) {
        setSearchedCari(data.Data[0]);
        setShowSearchResult(true);
        setTimeout(() => {
          setIsSearchResultVisible(true);
        }, 50);
      } else {
        setSearchedCari(null);
        throw new Error('Bu Cari Kodu ile kayÄ±t bulunamadÄ±');
      }
    } catch (err: any) {
      console.error('Cari arama hatasÄ±:', err);
      setError(`Cari arama hatasÄ±: ${err.message || 'Bilinmeyen hata'}`);
      setShowSearchResult(false);
      setIsSearchResultVisible(false);
      setSearchedCari(null);
    } finally {
      setIsSearching(false);
    }
  };

  // Add a function to handle the search card click
  const handleSearchCardClick = () => {
    if (showSearchResult) {
      setIsSearchResultVisible(false);
      setTimeout(() => {
        setShowSearchResult(false);
      }, 500);
    } else {
      setSearchCariKod('');
      setSearchedCari(null);
      setShowSearchResult(true);
      setTimeout(() => {
        setIsSearchResultVisible(true);
      }, 50);
    }
  };

  // Add a function to handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCariByCode(searchCariKod);
  };

  // Add a function to fetch statement header data
  const fetchStatementHeader = async (code: string) => {
    if (!code.trim()) {
      setError('LÃ¼tfen bir masraf kodu girin');
      return;
    }

    try {
      setIsStatementLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      
      // API isteÄŸi iÃ§in URL
      const apiUrl = `http://172.16.20.230:7171/api/v2/StatementsHeader/${encodeURIComponent(code)}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Masraf bilgisi alÄ±namadÄ±: HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.IsSuccessful && data.Data) {
        setStatementData(data.Data);
        setShowStatementForm(true);
        setTimeout(() => {
          setIsStatementFormVisible(true);
        }, 50);
      } else {
        setStatementData(null);
        throw new Error('Bu masraf kodu ile kayÄ±t bulunamadÄ±');
      }
    } catch (err: any) {
      console.error('Masraf bilgisi arama hatasÄ±:', err);
      setError(`Masraf bilgisi arama hatasÄ±: ${err.message || 'Bilinmeyen hata'}`);
      setStatementData(null);
    } finally {
      setIsStatementLoading(false);
    }
  };

  // Add a function to handle the statement card click
  const handleStatementCardClick = () => {
    if (showStatementForm) {
      setIsStatementFormVisible(false);
      setTimeout(() => {
        setShowStatementForm(false);
      }, 500);
    } else {
      setStatementCode('');
      setStatementData(null);
      setShowStatementForm(true);
      setTimeout(() => {
        setIsStatementFormVisible(true);
      }, 50);
    }
  };

  // Add a function to handle statement search form submission
  const handleStatementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStatementHeader(statementCode);
  };

  // Add fetchItemTransactions function
  const fetchItemTransactions = async (params: any = {}) => {
    try {
      setIsTransactionsLoading(true);
      setError(null);
      
      // Token kontrolÃ¼
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Token bulunamadÄ±, login sayfasÄ±na yÃ¶nlendiriliyor');
        router.push('/login');
        return;
      }

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', String(params.limit));
      if (params.offset) queryParams.append('offset', String(params.offset));
      if (params.first === true) queryParams.append('first', 'true');
      if (params.last === true) queryParams.append('last', 'true');

      const apiUrl = `http://172.16.20.230:7171/api/v2/ItemTransactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      console.log('API isteÄŸi gÃ¶nderiliyor:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Stok hareketleri alÄ±namadÄ±: HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      // API yanÄ±tÄ±nÄ± doÄŸru ÅŸekilde iÅŸle
      let transactions = [];
      if (data && data.Data) {
        // EÄŸer data.Data bir dizi ise direkt kullan, deÄŸilse diziye Ã§evir
        transactions = Array.isArray(data.Data) ? data.Data : [data.Data];
      } else if (Array.isArray(data)) {
        // EÄŸer yanÄ±t direkt bir dizi ise
        transactions = data;
      } else if (data) {
        // EÄŸer yanÄ±t tek bir nesne ise
        transactions = [data];
      }

      // Veriyi state'e kaydet
      setItemTransactions(transactions);
      
      // GÃ¶rÃ¼nÃ¼rlÃ¼ÄŸÃ¼ gÃ¼ncelle
      setShowTransactions(true);
      setTimeout(() => {
        setIsTransactionsVisible(true);
      }, 50);

    } catch (err: any) {
      console.error('Stok hareketleri yÃ¼klenirken hata:', err);
      setError(`Stok hareketleri yÃ¼klenirken bir hata oluÅŸtu: ${err.message || 'Bilinmeyen hata'}`);
      setItemTransactions([]);
    } finally {
      setIsTransactionsLoading(false);
    }
  };

  // Add function to handle transaction card clicks
  const handleTransactionCardClick = (params: any = {}) => {
    if (!params.force && showTransactions && !params.first && !params.last) {
      setIsTransactionsVisible(false);
      setTimeout(() => {
        setShowTransactions(false);
      }, 500);
    } else {
      fetchItemTransactions(params);
    }
  };

  const handleMasrafCardClick = () => {
    setShowMasrafKayit(!showMasrafKayit);
    if (!showMasrafKayit) {
      setIsFormVisible(true);
    } else {
      setIsFormVisible(false);
    }
  };
  
  const handleMasrafInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMasrafForm(prev => ({
      ...prev,
      [name]: name === 'Tutar' || name === 'Kdv_Oran' || name === 'Dekont_No' 
        ? parseFloat(value) || 0 
        : value
    }));
  };
  
  const handleMasrafSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingMasraf(true);
    setMasrafResponse(null);
    
    try {
      // Masraf kaydÄ± API isteÄŸi
      const masrafKalem: MasrafKalem = {
        Seri_No: masrafForm.Seri_No,
        Dekont_No: masrafForm.Dekont_No,
        Tarih: masrafForm.Tarih,
        Aciklama1: masrafForm.Aciklama,
        Kod: masrafForm.Kod,
        Tutar: masrafForm.Tutar,
        Kdv_Oran: masrafForm.Kdv_Oran,
        Proje_Kodu: masrafForm.Proje_Kodu,
        Fisno: masrafForm.Fisno
      };
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Oturum bulunamadÄ±. LÃ¼tfen tekrar giriÅŸ yapÄ±n.');
      }
      
      const response = await fetch('http://172.16.20.230:7171/api/v2/StatementsHeader/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(masrafKalem)
      });
      
      if (!response.ok) {
        throw new Error(`Masraf kaydÄ± baÅŸarÄ±sÄ±z: HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      setMasrafResponse({
        success: true,
        data: data
      });
      
      // Form alanlarÄ±nÄ± resetle
      setMasrafForm({
        Seri_No: "",
        Dekont_No: 0,
        Tarih: new Date().toISOString().split('T')[0],
        Firma_Adi: "",
        Aciklama: "",
        Kod: "",
        Tutar: 0,
        Kdv_Oran: 18,
        Proje_Kodu: "",
        Fisno: ""
      });
    } catch (error) {
      console.error("Masraf kaydÄ± hatasÄ±:", error);
      setMasrafResponse({
        success: false,
        error: error instanceof Error ? error.message : "Bir hata oluÅŸtu"
      });
    } finally {
      setSubmittingMasraf(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">YÃ¼kleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Navbar 
        onTokenRefresh={handleTokenRefresh}
        isDarkMode={isDarkMode}
        onThemeToggle={() => setIsDarkMode(!isDarkMode)}
      />
      
      <div className="max-w-7xl mx-auto p-8 flex-grow">
        {/* Cariler BÃ¶lÃ¼mÃ¼ */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Cariler</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Cari Listesi Card */}
            <div 
              onClick={() => handleCardClick()}
              className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 ${showTable ? 'ring-2 ring-indigo-500' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Cari Listesi</h2>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-1`}>
                    {showTable ? 'Listeyi gizle' : 'TÃ¼m carileri gÃ¶rÃ¼ntÃ¼le'}
                  </p>
                </div>
                <div className={`text-indigo-600 transform transition-transform duration-300 ${showTable ? 'rotate-180' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Yeni Cari KayÄ±t Card */}
            <div 
              onClick={handleCariFormCard}
              className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 ${showCariForm ? 'ring-2 ring-green-500' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Yeni Cari</h2>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-1`}>
                    {showCariForm ? 'Formu gizle' : 'Yeni cari kaydÄ± oluÅŸtur'}
                  </p>
                </div>
                <div className={`text-green-500 transform transition-transform duration-300 ${showCariForm ? 'rotate-180' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Cari Kod ile Arama Card */}
            <div 
              onClick={handleSearchCardClick}
              className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 ${showSearchResult ? 'ring-2 ring-purple-500' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Cari Kod Arama</h2>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-1`}>
                    {showSearchResult ? 'AramayÄ± gizle' : 'Cari kodu ile ara'}
                  </p>
                </div>
                <div className={`text-purple-600 transform transition-transform duration-300 ${showSearchResult ? 'rotate-180' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div></div>\s*</div>
          </div>
          
          {/* Show the customer list with pagination */}
          {showTable && (
            <div className={`transform transition-all duration-500 ease-in-out ${isTableVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg overflow-hidden`}>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Cari Listesi
                    </h3>
                    <span className={`px-4 py-2 rounded-full text-sm ${isDarkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800'}`}>
                      {cariList.length} KayÄ±t
                    </span>
                  </div>

                  {/* SayfalÄ± GÃ¶rÃ¼ntÃ¼leme Controls */}
                  <div className="mb-6">
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-grow max-w-xs">
                          <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            BaÅŸlangÄ±Ã§ KaydÄ±
                          </label>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="1"
                              value={cariFilters.offset || ''}
                              onChange={(e) => setCariFilters({
                                ...cariFilters,
                                offset: parseInt(e.target.value) || 1
                              })}
                              className={`w-full px-3 py-2 rounded-md ${
                                isDarkMode 
                                  ? 'bg-gray-600 border-gray-500 text-white' 
                                  : 'border-gray-300 text-gray-900'
                              } focus:ring-2 focus:ring-indigo-500`}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCardClick({ 
                                  limit: 10, 
                                  offset: cariFilters.offset || 1,
                                  force: true
                                });
                              }}
                              className={`px-4 py-2 rounded-md text-white ${
                                isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
                              } transition-colors duration-200`}
                            >
                              GÃ¶rÃ¼ntÃ¼le
                            </button>
                          </div>
                          <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Girilen kayÄ±ttan itibaren 10 kayÄ±t gÃ¶sterilir
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isCariLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
                    </div>
                  ) : cariList.length > 0 ? (
                    <>
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                            <tr>
                              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                Cari Kodu
                              </th>
                              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                Cari AdÄ±
                              </th>
                              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                Ä°l / Ä°lÃ§e
                              </th>
                              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                Adres
                              </th>
                              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                Ä°letiÅŸim
                              </th>
                              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                                Vergi Bilgileri
                              </th>
                            </tr>
                          </thead>
                          <tbody className={`${isDarkMode ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
                            {cariList.map((cari) => (
                              <tr key={cari.CariTemelBilgi.CARI_KOD} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {cari.CariTemelBilgi.CARI_KOD}
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {cari.CariTemelBilgi.CARI_ISIM}
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                  {cari.CariTemelBilgi.CARI_IL} / {cari.CariTemelBilgi.CARI_ILCE}
                                </td>
                                <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                  {cari.CariTemelBilgi.CARI_ADRES}
                                </td>
                                <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                  <div>Tel: {cari.CariTemelBilgi.CARI_TEL || '-'}</div>
                                </td>
                                <td className={`px-6 py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                  <div>Vergi Dairesi: {cari.CariTemelBilgi.VERGI_DAIRESI || '-'}</div>
                                  <div>Vergi No: {cari.CariTemelBilgi.VERGI_NUMARASI || '-'}</div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Buttons for Cari Listesi */}
                      <div className="mt-6 flex justify-center space-x-4">
                        <button
                          onClick={() => handleCardClick({ first: true, force: true })}
                          className={`flex items-center px-6 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                            isDarkMode 
                              ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                              : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                          </svg>
                          Ä°lk Sayfa
                        </button>
                        
                        <button
                          onClick={() => handleCardClick({ last: true, force: true })}
                          className={`flex items-center px-6 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                            isDarkMode 
                              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                              : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                          }`}
                        >
                          Son Sayfa
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium">KayÄ±t BulunamadÄ±</h3>
                      <p className="mt-1 text-sm">GÃ¶sterilecek cari kaydÄ± bulunmuyor.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cari Kod ile Arama Formu ve SonuÃ§larÄ± */}
        {showSearchResult && (
          <div className={`transform transition-all duration-500 ease-in-out mb-8 ${
            isSearchResultVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg p-6`}>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Cari Kod ile Arama
              </h3>

              <form onSubmit={handleSearchSubmit} className="mb-6">
                <div className="flex space-x-4">
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={searchCariKod}
                      onChange={(e) => setSearchCariKod(e.target.value)}
                      placeholder="Cari Kodu Girin (Ã¶rn: Y3641)"
                      className={`block w-full px-4 py-2 rounded-md ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300 placeholder-gray-500'
                      } shadow-sm focus:ring-purple-500 focus:border-purple-500`}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching}
                    className={`px-4 py-2 rounded-md text-sm font-medium text-white
                      ${isSearching ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}
                      transition-colors duration-200 flex items-center space-x-2`
                    }
                  >
                    {isSearching ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>AranÄ±yor...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span>Ara</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {searchedCari && (
                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 transition-opacity duration-300 ${searchedCari ? 'opacity-100' : 'opacity-0'}`}>
                  <h4 className={`text-md font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                    Cari Bilgileri
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <span className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Cari Kod:</span>
                        <span className={`block ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{searchedCari.CariTemelBilgi.CARI_KOD}</span>
                      </div>
                      <div>
                        <span className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Cari Ä°sim:</span>
                        <span className={`block ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{searchedCari.CariTemelBilgi.CARI_ISIM}</span>
                      </div>
                      <div>
                        <span className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Telefon:</span>
                        <span className={`block ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{searchedCari.CariTemelBilgi.CARI_TEL || '-'}</span>
                      </div>
                      <div>
                        <span className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Adres:</span>
                        <span className={`block ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{searchedCari.CariTemelBilgi.CARI_ADRES}</span>
                      </div>
                      <div>
                        <span className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Ä°l/Ä°lÃ§e:</span>
                        <span className={`block ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{searchedCari.CariTemelBilgi.CARI_IL} / {searchedCari.CariTemelBilgi.CARI_ILCE}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <span className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Vergi Dairesi:</span>
                        <span className={`block ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{searchedCari.CariTemelBilgi.VERGI_DAIRESI || '-'}</span>
                      </div>
                      <div>
                        <span className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Vergi NumarasÄ±:</span>
                        <span className={`block ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{searchedCari.CariTemelBilgi.VERGI_NUMARASI || '-'}</span>
                      </div>
                      <div>
                        <span className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Cari Tip:</span>
                        <span className={`block ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {searchedCari.CariTemelBilgi.CARI_TIP === 'A' ? 'AlÄ±cÄ±' : 
                           searchedCari.CariTemelBilgi.CARI_TIP === 'S' ? 'SatÄ±cÄ±' : 
                           searchedCari.CariTemelBilgi.CARI_TIP === 'B' ? 'AlÄ±cÄ±/SatÄ±cÄ±' : searchedCari.CariTemelBilgi.CARI_TIP}
                        </span>
                      </div>
                      <div>
                        <span className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>M Kodu:</span>
                        <span className={`block ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{searchedCari.CariTemelBilgi.M_KOD || '-'}</span>
                      </div>
                      <div>
                        <span className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Posta Kodu:</span>
                        <span className={`block ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{searchedCari.CariTemelBilgi.POSTAKODU || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stok Ä°ÅŸlemleri BÃ¶lÃ¼mÃ¼ */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Stok Ä°ÅŸlemleri</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stok Hareketleri Card */}
            <div 
              onClick={() => handleTransactionCardClick()}
              className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 ${showTransactions ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Stok Hareketleri</h2>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-1`}>
                    {showTransactions ? 'Listeyi gizle' : 'TÃ¼m hareketleri gÃ¶rÃ¼ntÃ¼le'}
                  </p>
                </div>
                <div className={`text-blue-600 transform transition-transform duration-300 ${showTransactions ? 'rotate-180' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className={`${isDarkMode ? 'bg-red-900 border-red-800 text-red-200' : 'bg-red-100 border-red-400 text-red-700'} px-4 py-3 rounded relative mb-8 border`} role="alert">
            <strong className="font-bold">Hata! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* ItemTransactions Results Section */}
        {showTransactions && (
          <div className={`transform transition-all duration-500 ease-in-out mb-8 ${
            isTransactionsVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg overflow-hidden`}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Stok Hareketleri
                  </h3>
                  <span className={`px-4 py-2 rounded-full text-sm ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                    {itemTransactions.length} KayÄ±t
                  </span>
                </div>

                {/* SayfalÄ± GÃ¶rÃ¼ntÃ¼leme Controls */}
                <div className="mb-6">
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex-grow max-w-xs">
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          BaÅŸlangÄ±Ã§ KaydÄ±
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="1"
                            value={transactionFilters.offset || ''}
                            onChange={(e) => setTransactionFilters({
                              ...transactionFilters,
                              offset: parseInt(e.target.value) || 1
                            })}
                            className={`w-full px-3 py-2 rounded-md ${
                              isDarkMode 
                                ? 'bg-gray-600 border-gray-500 text-white' 
                                : 'border-gray-300 text-gray-900'
                            } focus:ring-2 focus:ring-blue-500`}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTransactionCardClick({ 
                                limit: 10, 
                                offset: transactionFilters.offset || 1,
                                force: true
                              });
                            }}
                            className={`px-4 py-2 rounded-md text-white ${
                              isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                            } transition-colors duration-200`}
                          >
                            GÃ¶rÃ¼ntÃ¼le
                          </button>
                        </div>
                        <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Girilen kayÄ±ttan itibaren 10 kayÄ±t gÃ¶sterilir
                        </p>
                      </div>

                      <div className="flex items-center space-x-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTransactionCardClick({ first: true, force: true });
                          }}
                          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                            isDarkMode 
                              ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                              : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                          </svg>
                          Ä°lk Sayfa
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTransactionCardClick({ last: true, force: true });
                          }}
                          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                            isDarkMode 
                              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                              : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                          }`}
                        >
                          Son Sayfa
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {isTransactionsLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                  </div>
                ) : itemTransactions && itemTransactions.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                          <tr>
                            <th scope="col" className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Stok Kodu
                            </th>
                            <th scope="col" className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              FiÅŸ No
                            </th>
                            <th scope="col" className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Tarih
                            </th>
                            <th scope="col" className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Miktar 1
                            </th>
                            <th scope="col" className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Miktar 2
                            </th>
                            <th scope="col" className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Depo Kodu
                            </th>
                            <th scope="col" className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              AÃ§Ä±klama
                            </th>
                            <th scope="col" className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              Cari Kod
                            </th>
                          </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                          {itemTransactions.map((transaction, index) => (
                            <tr 
                              key={index} 
                              className={`${
                                isDarkMode 
                                  ? 'hover:bg-gray-700 bg-gray-800' 
                                  : 'hover:bg-gray-50 bg-white'
                              } transition-colors duration-150 ease-in-out`}
                            >
                              <td className="px-6 py-4">
                                <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {transaction?.Stok_Kodu || '-'}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                  {transaction?.Fisno || '-'}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                  {transaction?.Sthar_Tarih 
                                    ? new Date(transaction.Sthar_Tarih).toLocaleDateString('tr-TR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                      })
                                    : '-'
                                  }
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className={`text-sm font-medium ${
                                  typeof transaction?.Sthar_Gcmik === 'number'
                                    ? transaction.Sthar_Gcmik > 0
                                      ? 'text-green-500'
                                      : transaction.Sthar_Gcmik < 0
                                        ? 'text-red-500'
                                        : isDarkMode ? 'text-gray-300' : 'text-gray-900'
                                    : isDarkMode ? 'text-gray-300' : 'text-gray-900'
                                }`}>
                                  {typeof transaction?.Sthar_Gcmik === 'number'
                                    ? transaction.Sthar_Gcmik.toLocaleString('tr-TR', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                      })
                                    : '-'
                                  }
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className={`text-sm font-medium ${
                                  typeof transaction?.Sthar_Gcmik2 === 'number'
                                    ? transaction.Sthar_Gcmik2 > 0
                                      ? 'text-green-500'
                                      : transaction.Sthar_Gcmik2 < 0
                                        ? 'text-red-500'
                                        : isDarkMode ? 'text-gray-300' : 'text-gray-900'
                                    : isDarkMode ? 'text-gray-300' : 'text-gray-900'
                                }`}>
                                  {typeof transaction?.Sthar_Gcmik2 === 'number'
                                    ? transaction.Sthar_Gcmik2.toLocaleString('tr-TR', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                      })
                                    : '-'
                                  }
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  isDarkMode 
                                    ? 'bg-gray-700 text-gray-300' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {transaction?.DEPO_KODU || '-'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                  {transaction?.Sthar_Aciklama || '-'}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                  {transaction?.Sthar_Carikod || '-'}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination Buttons */}
                    <div className="mt-6 flex justify-center space-x-4">
                      <button
                        onClick={() => handleTransactionCardClick({ first: true })}
                        className={`flex items-center px-6 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                          isDarkMode 
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                            : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
                        Ä°lk Sayfa
                      </button>
                      
                      <button
                        onClick={() => handleTransactionCardClick({ last: true })}
                        className={`flex items-center px-6 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                          isDarkMode 
                            ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                            : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                        }`}
                      >
                        Son Sayfa
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium">KayÄ±t BulunamadÄ±</h3>
                    <p className="mt-1 text-sm">GÃ¶sterilecek stok hareketi bulunmuyor.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cari KayÄ±t Formu */}
        {showCariForm && (
          <div className={`transform transition-all duration-500 ease-in-out mb-8 ${
            isFormVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg p-6`}>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Yeni Cari KayÄ±t Formu
              </h3>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Cari Kodu *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.CARI_KOD}
                        onChange={(e) => setFormData({...formData, CARI_KOD: e.target.value})}
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Cari Ä°sim *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.CARI_ISIM}
                        onChange={(e) => setFormData({...formData, CARI_ISIM: e.target.value})}
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Adres *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.CARI_ADRES}
                        onChange={(e) => setFormData({...formData, CARI_ADRES: e.target.value})}
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Telefon *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.CARI_TEL}
                        onChange={(e) => setFormData({...formData, CARI_TEL: e.target.value})}
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Ä°l *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.CARI_IL}
                        onChange={(e) => setFormData({...formData, CARI_IL: e.target.value})}
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Ä°lÃ§e *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.CARI_ILCE}
                        onChange={(e) => setFormData({...formData, CARI_ILCE: e.target.value})}
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Cari Tip *
                      </label>
                      <select
                        required
                        value={formData.CARI_TIP}
                        onChange={(e) => setFormData({...formData, CARI_TIP: e.target.value})}
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      >
                        <option value="A">AlÄ±cÄ±</option>
                        <option value="S">SatÄ±cÄ±</option>
                        <option value="B">AlÄ±cÄ±/SatÄ±cÄ±</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        DÃ¶vizli Mi *
                      </label>
                      <select
                        required
                        value={formData.DOVIZLIMI}
                        onChange={(e) => setFormData({...formData, DOVIZLIMI: e.target.value})}
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      >
                        <option value="H">HayÄ±r</option>
                        <option value="E">Evet</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        M Kodu *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.M_KOD}
                        onChange={(e) => setFormData({...formData, M_KOD: e.target.value})}
                        placeholder="770-01-01-0047, 100-02-01-0001"
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Posta Kodu *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.POSTAKODU}
                        onChange={(e) => setFormData({...formData, POSTAKODU: e.target.value})}
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Vergi NumarasÄ± *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.VERGI_NUMARASI}
                        onChange={(e) => setFormData({...formData, VERGI_NUMARASI: e.target.value})}
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Vergi Dairesi *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.VERGI_DAIRESI}
                        onChange={(e) => setFormData({...formData, VERGI_DAIRESI: e.target.value})}
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Fax
                      </label>
                      <input
                        type="text"
                        value={formData.FAX}
                        onChange={(e) => setFormData({...formData, FAX: e.target.value})}
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      />
                    </div>
                  </div>
                </div>

                <div className={`mt-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-md`}>
                  <h4 className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                    Sistem DeÄŸerleri (Salt Okunur)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Åube Kodu:</span>
                      <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>1</span>
                    </div>
                    <div>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Ä°ÅŸletme Kodu:</span>
                      <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>1</span>
                    </div>
                    <div>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Detay Kodu:</span>
                      <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>0</span>
                    </div>
                    <div>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Vade GÃ¼nÃ¼:</span>
                      <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>0</span>
                    </div>
                    <div>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Ãœlke Kodu:</span>
                      <span className={`ml-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>TR</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormVisible(false);
                      setTimeout(() => setShowCariForm(false), 500);
                    }}
                    className={`px-4 py-2 text-sm font-medium ${
                      isDarkMode
                        ? 'text-gray-300 bg-gray-700 hover:bg-gray-600'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    Ä°ptal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
                  >
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showStatementForm && (
          <div className={`transform transition-all duration-500 ease-in-out mb-8 ${
            isStatementFormVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg p-6`}>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Masraf Bilgisi Arama
              </h3>

              <form onSubmit={handleStatementSubmit} className="mb-6">
                <div className="flex space-x-4">
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={statementCode}
                      onChange={(e) => setStatementCode(e.target.value)}
                      placeholder="Masraf Kodu Girin (Ã¶rn: HR;5799)"
                      className={`block w-full px-4 py-2 rounded-md ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300 placeholder-gray-500'
                      } shadow-sm focus:ring-amber-500 focus:border-amber-500`}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isStatementLoading}
                    className={`px-4 py-2 rounded-md text-sm font-medium text-white
                      ${isStatementLoading ? 'bg-amber-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600'}
                      transition-colors duration-200 flex items-center space-x-2`
                    }
                  >
                    {isStatementLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>AranÄ±yor...</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Ara</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {statementData && (
                <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-4 transition-opacity duration-300 ${statementData ? 'opacity-100' : 'opacity-0'}`}>
                  <h4 className={`text-md font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                    Masraf Bilgileri
                  </h4>
                  
                  {/* Main details summary - important fields only */}
                  <div className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
                        <h5 className={`font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-1`}>Dekont Bilgileri</h5>
                        <p className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {statementData.Seri_No || ''}{statementData.Dekont_No || ''}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                          {statementData.Tarih ? new Date(statementData.Tarih).toLocaleDateString('tr-TR') : '-'}
                        </p>
                      </div>
                      
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
                        <h5 className={`font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-1`}>Toplam Tutar</h5>
                        <p className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {Array.isArray(statementData.Details) ? 
                            statementData.Details.reduce((sum: number, detail: any) => sum + (detail.Tutar || 0), 0).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : 
                            '0.00'} TL
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                          KDV: {Array.isArray(statementData.Details) ? 
                            statementData.Details.reduce((sum: number, detail: any) => sum + ((detail.Kdv_Oran && detail.Tutar) ? (detail.Tutar * detail.Kdv_Oran / 100) : 0), 0).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : 
                            '0.00'} TL
                        </p>
                      </div>
                      
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
                        <h5 className={`font-medium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mb-1`}>Proje</h5>
                        <p className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {Array.isArray(statementData.Details) && statementData.Details.length > 0 ? 
                            statementData.Details[0].Proje_Kodu || '-' : 
                            '-'}
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                          KayÄ±t: {Array.isArray(statementData.Details) && statementData.Details.length > 0 ? 
                            (statementData.Details[0].KayitYapanKul || '-') : 
                            '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Detailed table of masraf entries */}
                  {statementData.Details && Array.isArray(statementData.Details) && statementData.Details.length > 0 && (
                    <div>
                      <h5 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                        Masraf DetaylarÄ±
                      </h5>
                      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} overflow-x-auto rounded-md shadow`}>
                        <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                          <thead className={isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}>
                            <tr>
                              <th className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                SÄ±ra No
                              </th>
                              <th className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                Tarih
                              </th>
                              <th className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                Tip
                              </th>
                              <th className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                Kod
                              </th>
                              <th className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                AÃ§Ä±klama
                              </th>
                              <th className={`px-4 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                B/A
                              </th>
                              <th className={`px-4 py-3 text-right text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                Tutar
                              </th>
                              <th className={`px-4 py-3 text-right text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                KDV %
                              </th>
                              <th className={`px-4 py-3 text-right text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                                KDV Tutar
                              </th>
                            </tr>
                          </thead>
                          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {statementData.Details.map((detail: any, index: number) => (
                              <tr key={index} className={isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
                                <td className={`px-4 py-3 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {detail.Sira_No || ''}
                                </td>
                                <td className={`px-4 py-3 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {detail.Tarih ? new Date(detail.Tarih).toLocaleDateString('tr-TR') : '-'}
                                </td>
                                <td className={`px-4 py-3 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {detail.C_M || '-'}
                                </td>
                                <td className={`px-4 py-3 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {detail.Kod || '-'}
                                </td>
                                <td className={`px-4 py-3 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {detail.Aciklama1 || '-'}
                                </td>
                                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                                  detail.B_A === 'B' 
                                    ? (isDarkMode ? 'text-red-400' : 'text-red-600')
                                    : (isDarkMode ? 'text-green-400' : 'text-green-600')
                                }`}>
                                  {detail.B_A === 'B' ? 'BorÃ§' : detail.B_A === 'A' ? 'Alacak' : detail.B_A || '-'}
                                </td>
                                <td className={`px-4 py-3 whitespace-nowrap text-sm text-right font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {detail.Tutar ? detail.Tutar.toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'}
                                </td>
                                <td className={`px-4 py-3 whitespace-nowrap text-sm text-right ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {detail.Kdv_Oran ? `%${detail.Kdv_Oran}` : '-'}
                                </td>
                                <td className={`px-4 py-3 whitespace-nowrap text-sm text-right font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {detail.Kdv_Oran && detail.Tutar
                                    ? (detail.Tutar * detail.Kdv_Oran / 100).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})
                                    : '0.00'
                                  }
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className={isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}>
                            <tr>
                              <td colSpan={6} className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} text-right`}>
                                Toplam:
                              </td>
                              <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} text-right`}>
                                {statementData.Details.reduce((sum: number, detail: any) => sum + (detail.Tutar || 0), 0).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                              </td>
                              <td className={`px-4 py-3 whitespace-nowrap text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} text-right`}>
                                
                              </td>
                              <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} text-right`}>
                                {statementData.Details.reduce((sum: number, detail: any) => sum + ((detail.Kdv_Oran && detail.Tutar) ? (detail.Tutar * detail.Kdv_Oran / 100) : 0), 0).toLocaleString('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
                  
                  {/* Optionally, view raw data in a collapsible section */}
                  <div className="mt-6">
                    <details className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <summary className="cursor-pointer font-medium">TÃ¼m Veri AlanlarÄ±</summary>
                      <div className="mt-2 max-h-60 overflow-y-auto p-4 rounded-md text-xs font-mono whitespace-pre-wrap break-all bg-opacity-50 bg-black text-gray-300">
                        {JSON.stringify(statementData, null, 2)}
                      </div>
                    </details>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Masraflar BÃ¶lÃ¼mÃ¼ */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Masraflar</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Masraf KayÄ±t Card */}
            <div 
              onClick={handleMasrafCardClick}
              className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 ${showMasrafKayit ? 'ring-2 ring-amber-500' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Masraf KaydÄ±</h2>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} mt-1`}>
                    {showMasrafKayit ? 'Formu gizle' : 'Yeni masraf kaydÄ± oluÅŸtur'}
                  </p>
                </div>
                <div className={`text-amber-500 transform transition-transform duration-300 ${showMasrafKayit ? 'rotate-180' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div></div>\s*</div>
          </div>
        </div>

        {showMasrafKayit && (
          <div className={`transform transition-all duration-500 ease-in-out mb-8 ${
            isFormVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg p-6`}>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
                Yeni Masraf KayÄ±t Formu
              </h3>
              <form onSubmit={handleMasrafSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Masraf Kodu *
                      </label>
                      <input
                        type="text"
                        required
                        value={masrafForm.Kod}
                        onChange={(e) => handleMasrafInputChange(e)}
                        name="Kod"
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Masraf AdÄ± *
                      </label>
                      <input
                        type="text"
                        required
                        value={masrafForm.Firma_Adi}
                        onChange={(e) => handleMasrafInputChange(e)}
                        name="Firma_Adi"
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Masraf AÃ§Ä±klamasÄ± *
                      </label>
                      <input
                        type="text"
                        required
                        value={masrafForm.Aciklama}
                        onChange={(e) => handleMasrafInputChange(e)}
                        name="Aciklama"
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Masraf TutarÄ± *
                      </label>
                      <input
                        type="number"
                        required
                        value={masrafForm.Tutar}
                        onChange={(e) => handleMasrafInputChange(e)}
                        name="Tutar"
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        KDV OranÄ± (%) *
                      </label>
                      <input
                        type="number"
                        required
                        value={masrafForm.Kdv_Oran}
                        onChange={(e) => handleMasrafInputChange(e)}
                        name="Kdv_Oran"
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Proje Kodu *
                      </label>
                      <input
                        type="text"
                        required
                        value={masrafForm.Proje_Kodu}
                        onChange={(e) => handleMasrafInputChange(e)}
                        name="Proje_Kodu"
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        FiÅŸ No *
                      </label>
                      <input
                        type="text"
                        required
                        value={masrafForm.Fisno}
                        onChange={(e) => handleMasrafInputChange(e)}
                        name="Fisno"
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Masraf Tarihi *
                      </label>
                      <input
                        type="date"
                        required
                        value={masrafForm.Tarih}
                        onChange={(e) => handleMasrafInputChange(e)}
                        name="Tarih"
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Seri No *
                      </label>
                      <input
                        type="text"
                        required
                        value={masrafForm.Seri_No}
                        onChange={(e) => handleMasrafInputChange(e)}
                        name="Seri_No"
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Dekont No *
                      </label>
                      <input
                        type="number"
                        required
                        value={masrafForm.Dekont_No}
                        onChange={(e) => handleMasrafInputChange(e)}
                        name="Dekont_No"
                        className={`mt-1 block w-full rounded-md ${
                          isDarkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'border-gray-300'
                        } shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormVisible(false);
                      setTimeout(() => setShowMasrafKayit(false), 500);
                    }}
                    className={`px-4 py-2 text-sm font-medium ${
                      isDarkMode
                        ? 'text-gray-300 bg-gray-700 hover:bg-gray-600'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                  >
                    Ä°ptal
                  </button>
                  <button
                    type="submit"
                    disabled={submittingMasraf}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
                  >
                    {submittingMasraf ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </div>
              </form>
              
              {/* Masraf iÅŸlemi sonuÃ§ mesajÄ± */}
              {masrafResponse && (
                <div className={`mt-4 p-4 rounded-md ${
                  masrafResponse.success 
                    ? (isDarkMode ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-800')
                    : (isDarkMode ? 'bg-red-800 text-red-100' : 'bg-red-100 text-red-800')
                }`}>
                  {masrafResponse.success ? (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <p>Masraf kaydÄ± baÅŸarÄ±yla oluÅŸturuldu!</p>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                      <p>Hata: {masrafResponse.error}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Modern Footer - Now sticky at the bottom */}
      <footer className={`border-t ${isDarkMode ? 'bg-gray-900 border-gray-800 text-gray-400' : 'bg-white border-gray-200 text-gray-600'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <h3 className={`text-sm font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                Kurumsal
              </h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm hover:underline">HakkÄ±mÄ±zda</a></li>
                <li><a href="#" className="text-sm hover:underline">Ä°letiÅŸim</a></li>
                <li><a href="#" className="text-sm hover:underline">Kariyer</a></li>
                <li><a href="#" className="text-sm hover:underline">Blog</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 

