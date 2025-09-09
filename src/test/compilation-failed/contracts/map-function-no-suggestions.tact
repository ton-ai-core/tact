contract Test {
    storage: map<Int, Int>;
    
    init() {
        self.storage = emptyMap();
    }
    
    fun test() {
        self.storage.completelyDifferentName(1, 2); // No similar functions
    }
    
    receive() {}
}