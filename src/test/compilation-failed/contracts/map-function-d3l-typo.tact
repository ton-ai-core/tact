contract Test {
    storage: map<Int, Int>;
    
    init() {
        self.storage = emptyMap();
    }
    
    fun test(): Bool {
        return self.storage.d3l(1); // Should suggest "del"
    }
    
    receive() {}
}