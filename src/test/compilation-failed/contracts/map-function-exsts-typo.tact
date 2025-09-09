contract Test {
    storage: map<Int, Int>;
    
    init() {
        self.storage = emptyMap();
    }
    
    fun test(): Bool {
        return self.storage.exsts(1); // Should suggest "exists"
    }
    
    receive() {}
}