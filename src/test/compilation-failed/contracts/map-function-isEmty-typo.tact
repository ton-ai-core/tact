contract Test {
    storage: map<Int, Int>;
    
    init() {
        self.storage = emptyMap();
    }
    
    fun test(): Bool {
        return self.storage.isEmty(); // Should suggest "isEmpty"
    }
    
    receive() {}
}